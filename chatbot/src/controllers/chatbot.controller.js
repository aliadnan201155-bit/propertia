import { Property } from '../models/property.model.js';
import { Groq } from 'groq-sdk';

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

  // Topics completely unrelated to real estate
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

  // Real estate related questions
  if (/property|house|flat|apartment|buy|sell|rent|lease|invest|location|area/.test(lower)) {
    return `🏠 Great question about real estate! I'd love to help you with property search!\n\nTell me what you're looking for:\n🏡 *"3-bedroom house in DHA"*\n🏢 *"Flat under 50 million in Gulberg"*\n🌟 *"Apartment in Bahria Town"*\n\nI can help you find the perfect property! 💚`;
  }

  // Price/budget questions
  if (/price|cost|expensive|cheap|affordable|budget|discount/.test(lower)) {
    return `💰 That's a smart question! Our properties have various price ranges.\n\nJust tell me your budget and location, and I'll show you amazing options! 🎯\n\n*For example: "Properties in DHA under 50 million"* ✨`;
  }

  // Location questions
  if (/where|location|area|city|place|neighborhood/.test(lower)) {
    let locations = availableLocations.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ');
    return `📍 We have amazing properties in: **${locations}**\n\nJust pick a location and tell me what you're looking for! 🌟`;
  }

  // Greeting/general
  if (/hi|hello|hey|how are|wassup|kya hal|suno|bhai/.test(lower)) {
    return `👋 Hello! I'm RoofrBot, your property assistant! 🏠\n\nReady to help you find an amazing property? Tell me what you're looking for! 💚`;
  }

  // Contact/help
  if (/contact|help|support|phone|email|call|whatsapp/.test(lower)) {
    return `📞 Need help from our team?\n\n📱 **WhatsApp:** 03242952477\n📧 **Email:** usamahk9111@gmail.com\n\nOur team is ready to assist you! 😊`;
  }

  // Default fallback for random questions
  return `🤔 That's an interesting question! But I'm specifically designed to help you find the perfect property. 🏠\n\nTell me what kind of property you're looking for, and I'll help you find it in seconds! 💚\n\n*Try: "3-bedroom in DHA" or "Flats under 50M in Gulberg"* 🎯`;
}

/**
 * Analyze user intent using Groq AI (with fallback to regex)
 */
async function analyzeUserIntentWithGroq(userMessage) {
  const filters = parseFallbackFilters(userMessage);

  try {
    const validLocations = availableLocations.join('|');
    const prompt = `Extract real estate search filters from: "${userMessage}"
Return ONLY valid JSON with no markdown: {"location":"${validLocations}|null", "maxPrice":null, "minRooms":null, "propertyType":"flat|house|null", "area":null}
Use null for missing values, not "null" string.
IMPORTANT: 
- For area, extract sub-locations like "Khadda Market", "Phase 5", "Block A", "Sector", "Market", etc.
- If user mentions a place name that's not in predefined locations, it could be an area/market name - capture it in "area"
- For example: "khadda market" -> set area to "khadda market"
- Extract any geographic identifier user mentions.`;

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_completion_tokens: 200,
      top_p: 1
    });

    let responseText = message.choices[0]?.message?.content || '';
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(responseText);

    // Clean up string 'null' values to actual null
    if (parsed.propertyType === 'null') parsed.propertyType = null;
    if (parsed.location === 'null') parsed.location = null;
    if (parsed.area === 'null') parsed.area = null;

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
    // Check if it's in millions, lakhs, or thousands
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

  // Extract area/market/sector keywords (for better search refinement)
  // Look for common area patterns like "Khadda Market", "Phase 5", "Block A", "Sector", etc.
  const areaPatterns = [
    /khadda\s+market/i,
    /phase\s+\d+/i,
    /block\s+[a-z]/i,
    /sector\s+\d+/i,
    /heights/i,
    /lakes/i,
    /enclave/i,
    /extension/i,
    /parkway/i,
    /lane/i,
    /valley/i,
    /garden/i,
    /park/i,
    /terrace/i,
    /avenue/i,
    /plaza/i,
    /towers/i,
    /complex/i,
    /market/i,
    /town(?!ship)/i,
    /view/i
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
 * Generate intelligent response using Gemini AI (with fallback)
 */
async function generateResponseWithGemini(userMessage, searchResults, filters) {
  try {
    if (searchResults.length === 0) {
      return `No properties found in ${filters.location || 'this area'}. Try different search criteria.`;
    }

    return `Found ${searchResults.length} properties matching your search!`;
  } catch (err) {
    console.warn('Response gen fallback:', err.message);
    return searchResults.length === 0
      ? `No properties found.`
      : `Found ${searchResults.length} properties!`;
  }
}

export const chat = async (req, res) => {
  try {
    const { message, selectedPropertyId } = req.body || {};
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    const text = message.trim();

    // Load available locations from database (refresh on every request for latest locations)
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
          .populate('owner', 'email fullName phone')
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

    // Check if question is completely off-topic (not related to real estate at all)
    if (isOffTopicQuestion(text)) {
      console.log('⚠️ Off-topic question detected');
      return res.json({
        success: true,
        reply: `😊 Sorry! I'm a real estate assistant and I only help with property-related queries. 🏠\n\nI'd be happy to help you find properties in areas like ${availableLocations.slice(0, 3).map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}!\n\n💡 Try asking:\n• "3-bedroom house in DHA"\n• "Flats under 50 million in Gulberg"\n• "Properties in Bahria Town"`,
        isGeneralResponse: true
      });
    }

    // Check if it's a general question (not property-related)
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

      // Use intelligent fallback
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

    // Check if user is searching by area only (not matching any main location)
    let searchByAreaOnly = false;
    if (!analyzedFilters.location && analyzedFilters.area) {
      console.log('🔍 Searching by area only:', analyzedFilters.area);
      searchByAreaOnly = true;
    }

    // Require location OR area - provide dynamic suggestions
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

    // Build search query
    const query = {};
    if (analyzedFilters.location) {
      query.location = analyzedFilters.location.toLowerCase();
    }
    if (analyzedFilters.maxPrice) query.price = { $lte: analyzedFilters.maxPrice };
    if (analyzedFilters.minRooms) query.rooms = { $gte: analyzedFilters.minRooms };
    if (analyzedFilters.propertyType && analyzedFilters.propertyType !== 'null' && analyzedFilters.propertyType !== null) {
      query.type = analyzedFilters.propertyType.toLowerCase();
    }
    if (analyzedFilters.area) query.area = new RegExp(analyzedFilters.area, 'i');

    console.log('Search Query:', JSON.stringify(query, null, 2));

    // Execute search
    const results = await Property.find(query)
      .populate('owner', 'email fullName phone')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    console.log(`Found ${results.length} properties${analyzedFilters.location ? ` for location: ${analyzedFilters.location}` : ' matching your search'}`);

    // If no results, try alternative searches
    if (!results || results.length === 0) {
      // Try without rooms filter
      const alternativeQuery = {};
      if (analyzedFilters.location) alternativeQuery.location = analyzedFilters.location.toLowerCase();
      if (analyzedFilters.maxPrice) alternativeQuery.price = { $lte: analyzedFilters.maxPrice };
      if (analyzedFilters.propertyType && analyzedFilters.propertyType !== 'null' && analyzedFilters.propertyType !== null) {
        alternativeQuery.type = analyzedFilters.propertyType.toLowerCase();
      }
      if (analyzedFilters.area) alternativeQuery.area = new RegExp(analyzedFilters.area, 'i');

      const alternativeResults = await Property.find(alternativeQuery)
        .populate('owner', 'email fullName phone')
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
            rooms: prop.rooms,
            type: prop.type,
            area: prop.area,
            images: prop.images,
            description: prop.description
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

    // Format results for display
    const options = ['A', 'B', 'C', 'D'];
    const displayResults = results.slice(0, 4).map((prop, idx) => ({
      _id: prop._id,
      option: options[idx],
      title: prop.title,
      price: prop.price,
      rooms: prop.rooms,
      type: prop.type,
      area: prop.area,
      images: prop.images,
      description: prop.description
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
