import Property from '../models/propertymodel.js';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

let availableLocations = []; // Will be populated from DB

/**
 * Detect if user is asking a completely off-topic question
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
        const prompt = `You are PropX, a friendly Pakistan real estate assistant. 
User asked: "${userMessage}"

Respond in a friendly, helpful way with emojis. Keep it concise (2-3 sentences).
If it's about real estate, mention that you can help with property search.
If it's not about real estate, be helpful but guide them back to property search.
Respond in the same language as the user (Urdu/English/Hinglish mix is fine).`;

        const message = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_completion_tokens: 150,
            top_p: 1
        });

        return message.choices?.message?.content || null;
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

    if (/property|house|flat|apartment|buy|sell|rent|lease|invest/.test(lower)) {
        return `🏠 Great question about real estate! I'd love to help you with property search!\n\nTell me what you're looking for:\n🏡 *"3-bedroom house in DHA"*\n🏢 *"Rent ke liye apartment"*\n🌟 *"3 beds se zyada wala ghar"*\n\nI can help you find the perfect property! 💚`;
    }
    if (/hi|hello|hey|how are|wassup|kya hal|suno|bhai/.test(lower)) {
        return `👋 Hello! I'm PropX, your property assistant! 🏠\n\nReady to help you find an amazing property? Tell me what you're looking for! 💚`;
    }
    if (/contact|help|support|phone|email|call|whatsapp/.test(lower)) {
        return `📞 Need help from our team?\n\n📱 **WhatsApp:** 03242952477\n📧 **Email:** usamahk9111@gmail.com\n\nOur team is ready to assist you! 😊`;
    }

    return `🤔 That's an interesting question! But I'm specifically designed to help you find the perfect property. 🏠\n\nTry asking: *"Rent ke liye ghar"* or *"Flats under 50M"* 🎯`;
}

/**
 * Fallback filter extraction using regex patterns (Safety net if AI fails)
 */
function parseFallbackFilters(text) {
    const lower = text.toLowerCase();
    const filters = {
        location: null, area: null, maxPrice: null, minPrice: null,
        exactRooms: null, minRooms: null, baths: null,
        propertyType: null, availability: null, sqft: null
    };

    for (const loc of availableLocations) {
        if (new RegExp(`\\b${loc.replace(/\s+/g, '\\s+')}\\b`, 'i').test(lower)) {
            filters.location = loc; break;
        }
    }

    if (/\brent\b|\bkiraya\b/.test(lower)) filters.availability = 'rent';
    if (/\bbuy\b|\bkharidna\b|\bsell\b/.test(lower)) filters.availability = 'buy';
    if (/\bflat\b|\bapartment\b|\bapt\b/.test(lower)) filters.propertyType = 'Apartment';
    if (/\bhouse\b|\bghar\b/.test(lower)) filters.propertyType = 'House';
    if (/\bvilla\b/.test(lower)) filters.propertyType = 'Villa';
    if (/\boffice\b/.test(lower)) filters.propertyType = 'Office';

    const roomsMatch = lower.match(/(\d+)\s*(?:bedroom|room|bed|bhk)/i);
    if (roomsMatch && !lower.includes('zyada') && !lower.includes('more')) {
        filters.exactRooms = parseInt(roomsMatch);
    }

    return filters;
}

/**
 * Analyze user intent using Groq AI
 */
async function analyzeUserIntentWithGroq(userMessage) {
    const fallbackFilters = parseFallbackFilters(userMessage);

    try {
        const safeMessage = userMessage.replace(/"/g, "'").replace(/\n/g, ' ').slice(0, 200);
        const locationSample = availableLocations.slice(0, 8).join(', ');

        const prompt = `You are an intelligent real estate search parser that understands English and Roman Urdu (e.g. "se zyada", "rent ke liye"). Extract filters from this query: "${safeMessage}"

Known locations: ${locationSample}

Return ONLY this JSON (no markdown, no extra text):
{
  "location": null,
  "area": null,
  "maxPrice": null,
  "minPrice": null,
  "exactRooms": null,
  "minRooms": null,
  "baths": null,
  "propertyType": null,
  "availability": null,
  "sqft": null
}

Rules:
- location: exact location name or null.
- exactRooms: Exact number of bedrooms if user says e.g. "3 bedroom".
- minRooms: If user says "3 se zyada" or "more than 3", set minRooms to 4.
- baths: Number of bathrooms.
- maxPrice: Number in PKR (e.g. 50 million = 50000000).
- minPrice: Number in PKR if a minimum is specified.
- propertyType: "House", "Apartment", "Office", or "Villa".
- availability: "rent" or "buy".
- sqft: Number for square feet area.
- area: sub-area like Phase 5 / Block A, or null.`;

        const message = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_completion_tokens: 150,
            top_p: 1
        });

        let responseText = message.choices?.message?.content || '';
        responseText = responseText.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) throw new Error('No JSON object found in response');

        const parsed = JSON.parse(jsonMatch);

        Object.keys(parsed).forEach(k => {
            if (parsed[k] === 'null' || parsed[k] === '') parsed[k] = null;
        });

        return { ...fallbackFilters, ...parsed };
    } catch (err) {
        console.warn('⚠️ Groq parsing failed, using fallback:', err.message);
        return fallbackFilters;
    }
}

/**
 * Main chat handler
 */
export const chat = async (req, res) => {
    try {
        const { message, selectedPropertyId } = req.body || {};

        // 1. Sabse pehle Detailed View check karo (Taake Server 500 Error na de)
        if (selectedPropertyId) {
            try {
                const property = await Property.findById(selectedPropertyId).populate('userId', 'name email').lean();
                if (property) {
                    return res.json({
                        success: true,
                        reply: `📍 Here are the complete details for **${property.title}**:`,
                        selectedProperty: property,
                        isDetailedView: true
                    });
                }
            } catch (err) {
                return res.status(400).json({ success: false, error: 'Property not found' });
            }
        }

        // 2. Agar View Details click nahi hua, tab zaroori hai ke user ka message ho
        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        const text = message.trim();

        // Load available locations
        try {
            const distinctLocations = await Property.distinct('location');
            availableLocations = distinctLocations.filter(loc => loc && loc.trim() !== '').map(loc => loc.toLowerCase());
        } catch (err) {
            console.error('Error loading locations:', err.message);
        }

        // Greeting detection
        if (/\b(hi|hello|hey|assalam|salam|start|begin|kmk|suno|bhai|ji|acha)\b/i.test(text)) {
            return res.json({
                success: true,
                reply: `👋 Assalamu Alaikum! Welcome to PropX! 🏠\n\nI'm your friendly property assistant. Tell me what you're looking for:\n🏡 *"Rent ke liye Apartment"*\n🏢 *"3 beds se zyada wala ghar"*\n🌟 *"DHA mein property under 50M"*`
            });
        }

        // Off-topic and General Qs
        if (isOffTopicQuestion(text)) {
            return res.json({
                success: true,
                reply: `😊 Sorry! I'm a real estate assistant and I only help with property-related queries. 🏠\n\n💡 Try asking:\n• "Rent ke liye ghar"\n• "3 bedroom flat"\n• "Properties in Bahria Town"`,
                isGeneralResponse: true
            });
        }

        if (isGeneralQuestion(text)) {
            const smartResponse = await generateSmartResponse(text);
            return res.json({
                success: true,
                reply: smartResponse || generateSmartFallbackResponse(text),
                isGeneralResponse: true
            });
        }

        // Analyze Intent
        const analyzedFilters = await analyzeUserIntentWithGroq(text);
        
        // Check if ANY filter is applied
        const hasAnyFilter = analyzedFilters.location || analyzedFilters.area || analyzedFilters.maxPrice || 
                             analyzedFilters.minPrice || analyzedFilters.exactRooms || analyzedFilters.minRooms || 
                             analyzedFilters.propertyType || analyzedFilters.availability || analyzedFilters.baths || analyzedFilters.sqft;

        if (!hasAnyFilter) {
            return res.json({
                success: true,
                reply: `🤔 Main samajh nahi paya. Aap kis tarah ki property dhoondh rahe hain?\n\n💡 Try karein: *"Rent ke liye Apartment"*, *"3 bedroom house"*, ya *"DHA mein property"*`
            });
        }

        // Build Smart DB Query
        const query = {};

        if (analyzedFilters.location) {
            query.location = { $regex: analyzedFilters.location, $options: 'i' };
        } else if (analyzedFilters.area) {
            query.location = { $regex: analyzedFilters.area, $options: 'i' };
        }

        if (analyzedFilters.maxPrice && analyzedFilters.minPrice) {
            query.price = { $gte: analyzedFilters.minPrice, $lte: analyzedFilters.maxPrice };
        } else if (analyzedFilters.maxPrice) {
            query.price = { $lte: analyzedFilters.maxPrice };
        } else if (analyzedFilters.minPrice) {
            query.price = { $gte: analyzedFilters.minPrice };
        }

        if (analyzedFilters.exactRooms) {
            query.beds = analyzedFilters.exactRooms;
        } else if (analyzedFilters.minRooms) {
            query.beds = { $gte: analyzedFilters.minRooms };
        }

        if (analyzedFilters.baths) query.baths = { $gte: analyzedFilters.baths };
        if (analyzedFilters.sqft) query.sqft = { $gte: analyzedFilters.sqft };

        if (analyzedFilters.propertyType && analyzedFilters.propertyType !== 'null') {
            query.type = { $regex: analyzedFilters.propertyType, $options: 'i' };
        }
        if (analyzedFilters.availability && analyzedFilters.availability !== 'null') {
            query.availability = { $regex: analyzedFilters.availability, $options: 'i' };
        }

        // Execute Search
        const results = await Property.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // If no results, try broader alternative search
        if (!results || results.length === 0) {
            const alternativeQuery = {};
            if (analyzedFilters.location) alternativeQuery.location = { $regex: analyzedFilters.location, $options: 'i' };
            if (analyzedFilters.availability) alternativeQuery.availability = { $regex: analyzedFilters.availability, $options: 'i' };
            if (analyzedFilters.propertyType) alternativeQuery.type = { $regex: analyzedFilters.propertyType, $options: 'i' };

            const alternativeResults = Object.keys(alternativeQuery).length > 0 ? 
                await Property.find(alternativeQuery).populate('userId', 'name email').sort({ createdAt: -1 }).limit(5).lean() : [];

            let reply = `🏠 Hmm, aapki exact requirement ke hisaab se mujhe koi property nahi mili.\n\n`;

            if (alternativeResults.length > 0) {
                reply += `✨ Lekin mujhe is se milti julti ${alternativeResults.length} properties mili hain! Kya aap inhe dekhna chahenge? 👀\n\n`;
                
                const altOptions = ['A', 'B', 'C', 'D', 'E'];
                const altProps = alternativeResults.map((prop, idx) => ({
                    _id: prop._id, option: altOptions[idx], title: prop.title, price: prop.price,
                    beds: prop.beds, type: prop.type, image: prop.image, description: prop.description, phone: prop.phone
                }));

                return res.json({
                    success: true, reply: reply, results: altProps, totalCount: altProps.length,
                    alternativeSearch: true, searchFilters: analyzedFilters
                });
            }

            reply += `📞 **Get personalized help from our experts:**\n📱 WhatsApp: **03242952477**\n📧 Email: **usamahk9111@gmail.com**\n\nHamari team aapki madad ke liye hamesha tayar hai! 😊✨`;

            return res.json({
                success: true, reply: reply, totalCount: 0, hasExactMatch: false,
                adminContact: { email: 'usamahk9111@gmail.com', phone: '03242952477' }
            });
        }

        // Format exact results
        const options = ['A', 'B', 'C', 'D'];
        const displayResults = results.slice(0, 4).map((prop, idx) => ({
            _id: prop._id, option: options[idx], title: prop.title, price: prop.price,
            beds: prop.beds, type: prop.type, image: prop.image, description: prop.description, phone: prop.phone
        }));

        const aiResponse = `🎉 Zabardast! Mujhe aapki requirement ke mutabiq ${results.length} properties mili hain! Ye rahe options:\n\n💚 *Click "View Full Details" to see more information!*`;

        return res.json({
            success: true, reply: aiResponse, results: displayResults, totalCount: results.length
        });

    } catch (err) {
        console.error('Chatbot error:', err);
        return res.status(500).json({ success: false, error: 'Internal error: ' + err.message });
    }
};