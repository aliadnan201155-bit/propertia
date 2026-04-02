import Property from '../models/propertymodel.js';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

let availableLocations = []; // Will be populated from DB

/**
 * Detect if user is asking a completely off-topic question (not related to real estate at all)
 */
function isOffTopicQuestion(text) {
    const lower = text.toLowerCase();

    const offTopicKeywords = [
        'drama', 'movie', 'film', 'actor', 'actress', 'celebrity', 'trending', 'viral',
        'cricket', 'football', 'sports', 'match', 'player', 'game',
        'recipe', 'food', 'cooking', 'dish', 'restaurant',
        'weather', 'temperature', 'rain', 'sunny',
        'joke', 'funny', 'meme', 'comedy',
        'politics', 'election', 'government', 'minister',
        'music', 'song', 'singer', 'album',
        'fashion', 'clothes', 'dress', 'style',
        'health', 'doctor', 'medicine', 'hospital',
        'school', 'college', 'university', 'education',
        'car', 'bike', 'vehicle', 'transport'
    ];

    return offTopicKeywords.some(keyword =>
        new RegExp(`\\b${keyword}\\b`, 'i').test(lower)
    );
}

/**
 * Detect if user is asking a general question (not property search)
 */
function isGeneralQuestion(text) {
    const generalKeywords = [
        'what', 'how', 'why', 'when', 'where', 'who', 'tell me', 'explain', 'describe',
        'best', 'good', 'bad', 'better', 'process', 'steps', 'help', 'guide',
        'kya', 'kaisy', 'kyun', 'kahan', 'kiski', 'kitna', 'batao', 'samjhao', 'batain'
    ];

    return generalKeywords.some(keyword =>
        new RegExp(`\\b${keyword}\\b`, 'i').test(text)
    );
}

/**
 * Generate intelligent response for general questions using Groq
 */
async function generateSmartResponse(userMessage) {
    try {
        const prompt = `You are RoofrBot, a friendly Pakistan real estate assistant. 
User asked: "${userMessage}"

Respond in a friendly, helpful way with emojis. Keep it concise (2-3 sentences).
If it's about real estate, mention that you can help with property search in locations: ${availableLocations.join(', ')}.
If it's not about real estate, be helpful but guide them back to property search.
Respond in the same language as the user (Urdu/English/Hinglish mix is fine).`;

        const message = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_completion_tokens: 150,
            top_p: 1
        });

        return message.choices[0]?.message?.content || null;
    } catch (err) {
        console.warn('⚠️ Smart response generation failed:', err.message);
        return null;
    }
}

/**
 * Generate smart fallback response based on keywords
 */
function generateSmartFallbackResponse(userMessage) {
    const lower = userMessage.toLowerCase();

    if (/property|house|flat|apartment|buy|sell|rent|lease|invest|location|area/.test(lower)) {
        return `🏠 Great question about real estate! I'd love to help you with property search!\n\nTell me what you're looking for:\n🏡 *"3-bedroom house in DHA"*\n🏢 *"Flat under 50 million in Gulberg"*\n🌟 *"Apartment in Bahria Town"*\n\nI can help you find the perfect property! 💚`;
    }

    if (/price|cost|expensive|cheap|affordable|budget|discount/.test(lower)) {
        return `💰 That's a smart question! Our properties have various price ranges.\n\nJust tell me your budget and location, and I'll show you amazing options! 🎯\n\n*For example: "Properties in DHA under 50 million"* ✨`;
    }

    if (/where|location|area|city|place|neighborhood/.test(lower)) {
        let locations = availableLocations.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ');
        return `📍 We have amazing properties in: **${locations}**\n\nJust pick a location and tell me what you're looking for! 🌟`;
    }

    if (/hi|hello|hey|how are|wassup|kya hal|suno|bhai/.test(lower)) {
        return `👋 Hello! I'm RoofrBot, your property assistant! 🏠\n\nReady to help you find an amazing property? Tell me what you're looking for! 💚`;
    }

    if (/contact|help|support|phone|email|call|whatsapp/.test(lower)) {
        return `📞 Need help from our team?\n\n📱 **WhatsApp:** 03242952477\n📧 **Email:** usamahk9111@gmail.com\n\nOur team is ready to assist you! 😊`;
    }

    return `🤔 That's an interesting question! But I'm specifically designed to help you find the perfect property. 🏠\n\nTell me what kind of property you're looking for, and I'll help you find it in seconds! 💚\n\n*Try: "3-bedroom in DHA" or "Flats under 50M in Gulberg"* 🎯`;
}

/**
 * Analyze user intent using Groq AI (with fallback to regex)
 */
async function analyzeUserIntentWithGroq(userMessage) {
    const filters = parseFallbackFilters(userMessage);

    try {
        // Sanitize user message to avoid breaking JSON in the prompt
        const safeMessage = userMessage.replace(/"/g, "'").replace(/\n/g, ' ').slice(0, 200);

        // Keep location list short to avoid JSON truncation at position 635
        const locationSample = availableLocations.slice(0, 8).join(', ');

        const prompt = `You are a real estate search parser. Extract filters from this query: "${safeMessage}"

Known locations (pick one if matched): ${locationSample}

Return ONLY this JSON (no markdown, no extra text):
{"location":null,"maxPrice":null,"minRooms":null,"propertyType":null,"area":null}

Rules:
- location: one of the known locations above, lowercase, or null
- maxPrice: number in PKR (e.g. 50 million = 50000000), or null
- minRooms: integer number of bedrooms, or null
- propertyType: "flat" or "house" or null
- area: sub-area like Phase 5 / Block A / Sector, or null`;

        const message = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_completion_tokens: 120,
            top_p: 1
        });

        let responseText = message.choices[0]?.message?.content || '';
        // Strip any markdown code fences
        responseText = responseText.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
        // Extract just the JSON object if there's surrounding text
        const jsonMatch = responseText.match(/\{[^}]+\}/);
        if (!jsonMatch) throw new Error('No JSON object found in response');

        const parsed = JSON.parse(jsonMatch[0]);

        // Normalize string 'null' to actual null
        Object.keys(parsed).forEach(k => {
            if (parsed[k] === 'null' || parsed[k] === '') parsed[k] = null;
        });

        return { ...filters, ...parsed };
    } catch (err) {
        console.warn('⚠️ Groq fallback:', err.message);
        return filters;
    }
}

/**
 * Fallback filter extraction using regex patterns
 */
function parseFallbackFilters(text) {
    const lower = text.toLowerCase();
    const filters = {
        location: null,
        minPrice: null,
        maxPrice: null,
        minRooms: null,
        propertyType: null,
        area: null,
        intent: 'search'
    };

    // Extract location from available locations in DB
    for (const loc of availableLocations) {
        const pattern = new RegExp(`\\b${loc.replace(/\s+/g, '\\s+')}\\b`, 'i');
        if (pattern.test(lower)) {
            filters.location = loc;
            break;
        }
    }

    // Extract max price
    const priceMatch = lower.match(/(\d+)\s*(?:million|m|lac|lakh|k)/i);
    if (priceMatch) {
        const amount = parseInt(priceMatch[1]);
        if (/million|m/i.test(priceMatch[0])) {
            filters.maxPrice = amount * 1000000;
        } else if (/lac|lakh/i.test(priceMatch[0])) {
            filters.maxPrice = amount * 100000;
        } else if (/k/i.test(priceMatch[0])) {
            filters.maxPrice = amount * 1000;
        }
    }

    // Extract bedrooms
    const roomsMatch = lower.match(/(\d+)\s*(?:bedroom|room|bed|bhk)/i);
    if (roomsMatch) {
        filters.minRooms = parseInt(roomsMatch[1]);
    }

    // Extract property type
    if (/\bflat\b|\bapartment\b|\bapt\b/.test(lower)) filters.propertyType = 'flat';
    if (/\bhouse\b|\bvilla\b/.test(lower)) filters.propertyType = 'house';

    // Extract area/market/sector keywords
    // Note: generic words like 'town', 'park', 'view', 'market' are excluded
    // because they often appear inside location names (e.g. 'bahria town')
    const areaPatterns = [
        /khadda\s+market/i,
        /phase\s+\d+/i,
        /block\s+[a-z\d]+/i,
        /sector\s+[a-z\d]+/i,
        /heights/i,
        /lakes/i,
        /enclave/i,
        /extension/i,
        /parkway/i,
        /valley/i,
        /terrace/i,
        /avenue/i,
        /plaza/i,
        /complex/i
    ];

    for (const pattern of areaPatterns) {
        const match = lower.match(pattern);
        if (match) {
            filters.area = match[0].trim();
            break;
        }
    }

    return filters;
}

/**
 * Main chat handler
 */
export const chat = async (req, res) => {
    try {
        const { message, selectedPropertyId } = req.body || {};
        if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

        const text = message.trim();

        // Load available locations from database
        try {
            const distinctLocations = await Property.distinct('location');
            availableLocations = distinctLocations.filter(loc => loc && loc.trim() !== '').map(loc => loc.toLowerCase());
            console.log('📍 Available locations (updated):', availableLocations);
        } catch (err) {
            console.error('Error loading locations:', err.message);
        }

        // Handle property detail view
        if (selectedPropertyId) {
            try {
                const property = await Property.findById(selectedPropertyId)
                    .populate('userId', 'name email')
                    .lean();

                if (property) {
                    return res.json({
                        success: true,
                        reply: `📍 Here are the complete details for **${property.title}**:`,
                        selectedProperty: property,
                        isDetailedView: true
                    });
                }
            } catch (err) {
                console.error('Property fetch error:', err);
                return res.status(400).json({ success: false, error: 'Property not found' });
            }
        }

        // Greeting detection
        if (/\b(hi|hello|hey|assalam|salam|start|begin|kmk|suno|bhai|ji|acha)\b/i.test(text)) {
            let locationSuggestions = '';
            if (availableLocations.length > 0) {
                locationSuggestions = `\n\n📍 **Available locations:** ${availableLocations.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}`;
            }

            return res.json({
                success: true,
                reply: `👋 Assalamu Alaikum! Welcome to RoofrBot! 🏠\n\nI'm your friendly property assistant, here to help you find your perfect home! 💚\n\nTell me what you're looking for:\n🏡 *"3-bedroom house in DHA"*\n🏢 *"Flat under 50 million in Gulberg"*\n🌟 *"2-bed apartment in Bahria Town"*${locationSuggestions}`
            });
        }

        // Check if question is completely off-topic
        if (isOffTopicQuestion(text)) {
            console.log('⚠️ Off-topic question detected');
            return res.json({
                success: true,
                reply: `😊 Sorry! I'm a real estate assistant and I only help with property-related queries. 🏠\n\nI'd be happy to help you find properties in areas like ${availableLocations.slice(0, 3).map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}!\n\n💡 Try asking:\n• "3-bedroom house in DHA"\n• "Flats under 50 million in Gulberg"\n• "Properties in Bahria Town"`,
                isGeneralResponse: true
            });
        }

        // Check if it's a general question
        if (isGeneralQuestion(text)) {
            console.log('🤖 Generating smart response for general question');
            const smartResponse = await generateSmartResponse(text);

            if (smartResponse) {
                return res.json({
                    success: true,
                    reply: smartResponse,
                    isGeneralResponse: true
                });
            }

            const fallbackResponse = generateSmartFallbackResponse(text);
            return res.json({
                success: true,
                reply: fallbackResponse,
                isGeneralResponse: true
            });
        }

        // Analyze user intent for property search
        const analyzedFilters = await analyzeUserIntentWithGroq(text);
        console.log('Filters extracted:', analyzedFilters);

        // Check if user is searching by area only
        let searchByAreaOnly = false;
        if (!analyzedFilters.location && analyzedFilters.area) {
            console.log('🔍 Searching by area only:', analyzedFilters.area);
            searchByAreaOnly = true;
        }

        // Require location OR area
        if (!analyzedFilters.location && !searchByAreaOnly) {
            let locationList = '';
            if (availableLocations.length > 0) {
                locationList = `\n\n📌 **Choose from these locations:**\n${availableLocations.map(loc => `• ${loc.charAt(0).toUpperCase() + loc.slice(1)}`).join('\n')}`;
            } else {
                locationList = '\n\n📌 **Available locations:** DHA, Gulberg, Bahria Town, Cantt, Faisal Town';
            }

            return res.json({
                success: true,
                reply: `🤔 I need a location to help you better! ${locationList}\n\n💡 For example: *"Show me 3-bedroom in DHA"* or *"Flats in Gulberg under 50 million"*`
            });
        }

        // Build search query adapted for backend Property model
        const query = {};

        // Location: simple regex match on the location field
        // When both location + area exist, search by location only (area is a sub-filter refinement)
        if (analyzedFilters.location) {
            query.location = { $regex: analyzedFilters.location, $options: 'i' };
        } else if (analyzedFilters.area) {
            // No main location identified — search area term against location field
            query.location = { $regex: analyzedFilters.area, $options: 'i' };
        }

        // Price filter
        if (analyzedFilters.maxPrice) query.price = { $lte: analyzedFilters.maxPrice };

        // Bedrooms: backend uses 'beds' instead of 'rooms'
        if (analyzedFilters.minRooms) query.beds = { $gte: analyzedFilters.minRooms };

        // Property type — backend 'type' field can be e.g. 'House for Sale', 'Flat'
        // Use regex so 'flat' matches 'Flat for Sale', 'house' matches 'House for Rent', etc.
        if (analyzedFilters.propertyType && analyzedFilters.propertyType !== 'null' && analyzedFilters.propertyType !== null) {
            query.type = { $regex: analyzedFilters.propertyType, $options: 'i' };
        }

        console.log('Search Query:', JSON.stringify(query, null, 2));

        // Execute search — backend uses 'userId' instead of 'owner'
        const results = await Property.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        console.log(`Found ${results.length} properties${analyzedFilters.location ? ` for location: ${analyzedFilters.location}` : ' matching your search'}`);

        // If no results, try alternative searches
        if (!results || results.length === 0) {
            const alternativeQuery = {};
            if (analyzedFilters.location) alternativeQuery.location = new RegExp(analyzedFilters.location, 'i');
            if (analyzedFilters.maxPrice) alternativeQuery.price = { $lte: analyzedFilters.maxPrice };
            if (analyzedFilters.propertyType && analyzedFilters.propertyType !== 'null' && analyzedFilters.propertyType !== null) {
                alternativeQuery.type = new RegExp(analyzedFilters.propertyType, 'i');
            }
            if (analyzedFilters.area) alternativeQuery.location = new RegExp(analyzedFilters.area, 'i');

            const alternativeResults = await Property.find(alternativeQuery)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            let reply = '';
            let locationDisplay = analyzedFilters.location || (analyzedFilters.area ? `"${analyzedFilters.area}"` : 'this location');

            if (analyzedFilters.minRooms) {
                reply = `😢 Oops! We don't have a ${analyzedFilters.minRooms}-bedroom property available in ${locationDisplay} right now, but don't worry! New listings come every day! 🎉\n\n`;

                if (alternativeResults.length > 0) {
                    reply += `✨ But here's some good news! I found ${alternativeResults.length} other amazing properties in ${locationDisplay} that might interest you! Would you like to check them out? 👀\n\n`;

                    const altOptions = ['A', 'B', 'C', 'D', 'E'];
                    const altProps = alternativeResults.slice(0, 5).map((prop, idx) => ({
                        _id: prop._id,
                        option: altOptions[idx],
                        title: prop.title,
                        price: prop.price,
                        beds: prop.beds,
                        type: prop.type,
                        image: prop.image,
                        description: prop.description,
                        phone: prop.phone
                    }));

                    return res.json({
                        success: true,
                        reply: reply,
                        results: altProps,
                        totalCount: altProps.length,
                        alternativeSearch: true,
                        hasExactMatch: false,
                        searchFilters: analyzedFilters
                    });
                }
            }

            // No results at all - show contact info
            let locationText = analyzedFilters.location || (analyzedFilters.area ? `"${analyzedFilters.area}"` : 'this area');
            reply = `🏠 Hmm, we couldn't find exactly what you're looking for in ${locationText} right now.\n\n`;
            reply += `💡 **But don't lose hope!** Our amazing team is constantly adding new properties! 🚀\n\n`;
            reply += `📞 **Get personalized help from our experts:**\n\n`;
            reply += `📱 WhatsApp: **03242952477**\n`;
            reply += `📧 Email: **usamahk9111@gmail.com**\n\n`;
            reply += `Just tell them what you're looking for, and they'll find the perfect property for you within 24 hours! They're super friendly and always ready to help. 😊✨`;

            return res.json({
                success: true,
                reply: reply,
                totalCount: 0,
                hasExactMatch: false,
                searchFilters: analyzedFilters,
                adminContact: {
                    email: 'usamahk9111@gmail.com',
                    phone: '03242952477'
                }
            });
        }

        // Format results for display — using backend field names (beds, image, phone)
        const options = ['A', 'B', 'C', 'D'];
        const displayResults = results.slice(0, 4).map((prop, idx) => ({
            _id: prop._id,
            option: options[idx],
            title: prop.title,
            price: prop.price,
            beds: prop.beds,
            type: prop.type,
            image: prop.image,
            description: prop.description,
            phone: prop.phone
        }));

        let finalLocationDisplay = analyzedFilters.location || (analyzedFilters.area ? `"${analyzedFilters.area}"` : 'this location');
        const aiResponse = `🎉 Wonderful! I found ${results.length} amazing properties in ${finalLocationDisplay}! Here are your options:\n\n💚 *Click "View Details" to see the complete information, images, and owner details!*`;

        return res.json({
            success: true,
            reply: aiResponse,
            results: displayResults,
            totalCount: results.length,
            searchFilters: analyzedFilters
        });

    } catch (err) {
        console.error('Chatbot error:', err);
        return res.status(500).json({ success: false, error: 'Internal error: ' + err.message });
    }
};
