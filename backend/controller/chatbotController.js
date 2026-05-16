import Property from '../models/propertymodel.js';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let availableLocations = [];

// ═════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════

const AMENITY_MAP = {
    'swimming pool'   : ['pool', 'swim', 'swimming'],
    'home theater'    : ['theater', 'theatre', 'cinema', 'movie room'],
    'gym'             : ['gym', 'gymnasium', 'fitness', 'workout', 'exercise room'],
    'parking'         : ['parking', 'garage', 'car park', 'parking space'],
    'garden'          : ['garden', 'yard', 'lawn', 'backyard'],
    'security'        : ['security', 'guard', 'cctv', 'surveillance', 'gated'],
    'elevator'        : ['elevator', 'lift'],
    'balcony'         : ['balcony', 'terrace', 'patio', 'veranda'],
    'generator'       : ['generator', 'backup power', 'ups', 'genset'],
    'solar panels'    : ['solar', 'solar panels', 'solar energy'],
    'internet'        : ['internet', 'wifi', 'wi-fi', 'broadband', 'fiber'],
    'air conditioning': ['ac', 'air conditioning', 'air conditioner', 'cooling'],
    'central heating' : ['heating', 'heater', 'central heating'],
    'store room'      : ['store room', 'storage', 'storeroom'],
    'servant quarters': ['servant quarters', 'servant room', 'maid room'],
    'rooftop'         : ['rooftop', 'roof top', 'roof access'],
};

const CONTACT = { phone: '+92 (021) 567-567', email: 'support@propertia.com' };

// ═════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

function resolveAmenity(keyword) {
    const lower = keyword.toLowerCase().trim();
    for (const [canonical, synonyms] of Object.entries(AMENITY_MAP)) {
        if (synonyms.some(s => s.includes(lower) || lower.includes(s))) {
            return canonical;
        }
    }
    return lower;
}

function buildLocationPatterns(locationStr) {
    const lower = locationStr.trim().toLowerCase();
    const patterns = new Set();

    patterns.add(lower);
    const noSpaces = lower.replace(/\s+/g, '');
    if (noSpaces !== lower) patterns.add(noSpaces);
    if (lower.includes(' ')) patterns.add(lower.replace(/\s+/g, '[\\s\\-]*'));
    if (!lower.includes(' ') && lower.length <= 25) patterns.add(lower.split('').join('[\\s\\-]?'));
    
    const words = lower.split(/\s+/).filter(w => w.length > 2);
    words.forEach(w => patterns.add(w));

    return [...patterns].map(p => ({ 
        $or: [
            { location: { $regex: p, $options: 'i' } },
            { title: { $regex: p, $options: 'i' } }  // NEW: search title too
        ]
    }));
}

function isOffTopicQuestion(text) {
    const lower = text.toLowerCase();

    const newsAndPeoplePhrases = [
        /\btrump\b/, /\bbiden\b/, /\bmodi\b/, /\bimran\b/, /\bzardari\b/,
        /\bnews\b/, /\bbreaking\b/, /\blatest\b.*\bnews\b/, /\btoday.*news\b/,
        /\bwhat is.*doing\b/, /\bwhat did.*say\b/, /\bwho is.*president\b/,
        /\bwho is.*prime minister\b/, /\bcurrent.*affairs\b/, /\bworld.*news\b/,
        /\bstock market\b/, /\bshare price\b/, /\bdollar rate\b/, /\busd.*pkr\b/,
        /\bcrypto\b/, /\bbitcoin\b/, /\bwar\b/, /\bconflict\b/,
    ];
    if (newsAndPeoplePhrases.some(rx => rx.test(lower))) return true;

    const offTopicKeywords = [
        'drama', 'movie', 'film', 'actor', 'actress', 'celebrity', 'trending', 'viral',
        'netflix', 'youtube', 'tiktok', 'instagram', 'twitter', 'facebook',
        'cricket', 'football', 'soccer', 'sports', 'match', 'player', 'tournament',
        'fifa', 'psl', 'ipl', 'worldcup', 'olympics',
        'recipe', 'food', 'cooking', 'dish', 'biryani', 'pizza',
        'weather', 'temperature', 'rain', 'sunny', 'forecast', 'humidity',
        'joke', 'funny', 'meme', 'comedy', 'prank',
        'politics', 'election', 'government', 'minister', 'parliament', 'vote',
        'music', 'song', 'singer', 'album', 'concert', 'lyrics',
        'fashion', 'clothes', 'dress', 'style', 'outfit', 'makeup',
        'health', 'doctor', 'medicine', 'hospital', 'disease', 'symptoms', 'treatment',
        'school', 'college', 'university', 'education', 'degree', 'exam', 'admission',
        'car', 'bike', 'vehicle', 'transport', 'motorcycle', 'truck',
        'iphone', 'android', 'laptop', 'gaming', 'software', 'coding',
    ];

    return offTopicKeywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(lower));
}

// ═════════════════════════════════════════════════════════════════════════════
// GROQ INTENT EXTRACTION (THE CORE)
// ═════════════════════════════════════════════════════════════════════════════

async function analyzeUserIntent(userMessage) {
    try {
        const safe = userMessage.replace(/"/g, "'").slice(0, 400);
        const locationSample = availableLocations.slice(0, 8).join(', ');

        const prompt = `You are PropX real estate assistant. Analyze this query and extract structured intent: "${safe}"

Known locations: ${locationSample}

Return ONLY valid JSON (no markdown):
{
  "queryType": "SEARCH",
  "language": "english",
  "location": null,
  "propertyType": null,
  "availability": null,
  "exactRooms": null,
  "minRooms": null,
  "maxRooms": null,
  "exactBaths": null,
  "minBaths": null,
  "exactSqft": null,
  "minSqft": null,
  "maxSqft": null,
  "minPrice": null,
  "maxPrice": null,
  "amenitiesInclude": [],
  "amenitiesExclude": [],
  "sortBy": null,
  "limit": null
}

Rules:

queryType — exactly ONE of:
  "GREETING" → hi, hello, hey, salam, wassup, bye, goodbye, alvida, khuda hafiz
  "COUNT" → how many properties, total listings, kitne hain
  "EXTREME" → most expensive, cheapest, biggest, smallest, sabse mehnga, sabse sasta
  "SEARCH" → any property search with filters
  "RECOMMEND" → show me something, suggest me, recommend, kuch dikhao
  "INFO" → what can you do, how does this work, help

language — detect user's language:
  "english" | "roman_urdu" | "mixed"
  Examples: "show me" → english, "dikhao" → roman_urdu, "show me dikhao" → mixed

location: partial name OK. "emaar" → "emaar". null if not mentioned.

propertyType: "House", "Apartment", "Office", or "Villa". "flat"→"Apartment", "ghar"→"House".

availability: "rent" or "buy". "kiraya"→"rent", "kharidna"→"buy".

exactRooms: INTEGER. Use when "2 bedroom" (exact). Do NOT also set minRooms/maxRooms.
minRooms: INTEGER. Use when "more than 2", "2 se zyada", "at least 3". Do NOT set exactRooms.
maxRooms: INTEGER. Use when "upto 3 beds", "max 3 rooms". Do NOT set exactRooms.

exactBaths/minBaths: same logic as rooms.

exactSqft/minSqft/maxSqft: same logic.

minPrice/maxPrice: NUMBER in PKR. "50 lakh"=5000000, "1 crore"=10000000, "50M"=50000000.

amenitiesInclude: ARRAY of mentioned amenities e.g. ["pool","gym"].
amenitiesExclude: ARRAY of excluded amenities. "without parking", "no generator" → ["parking"], ["generator"].

sortBy: ONE of exactly:
  "price_desc" → most expensive, sabse mehnga, expensive, highest price
  "price_asc" → cheapest, sabse sasta, sasta, lowest price, affordable, budget friendly
  "sqft_desc" → biggest, largest, sabse bada, bari jagah, most spacious
  "sqft_asc" → smallest, sabse chota, choti si
  "beds_desc" → most rooms, zyada kamre
  "newest" → latest, newest, recent, naya, new listing
  "oldest" → oldest, purana
  null if no sort intent

limit: INTEGER. Extract from "top 5", "first 10", "show me 3". null otherwise (defaults to 10).

IMPORTANT:
- For EXTREME queryType, ALSO set sortBy and limit=1
- For COUNT queryType, DO NOT set sortBy
- For "cheapest 3 bed house in DHA" → queryType=SEARCH, exactRooms=3, location="dha", sortBy="price_asc"
  (SEARCH type supports filters+sorting combined)
- "sasti property" → sortBy="price_asc", maxPrice could also be inferred if context suggests budget
- Negative/invalid values (0 beds, -5 price) → ignore, set null`;

        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.05,
            max_completion_tokens: 300,
        });

        let text = response.choices[0]?.message?.content || '';
        text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON in response');

        const parsed = JSON.parse(match[0]);

        // Sanitize
        Object.keys(parsed).forEach(k => {
            if (parsed[k] === 'null' || parsed[k] === '' || parsed[k] === 'undefined') {
                parsed[k] = (k === 'amenitiesInclude' || k === 'amenitiesExclude') ? [] : null;
            }
        });

        if (!Array.isArray(parsed.amenitiesInclude)) parsed.amenitiesInclude = [];
        if (!Array.isArray(parsed.amenitiesExclude)) parsed.amenitiesExclude = [];

        // Type coercion
        const numFields = ['exactRooms','minRooms','maxRooms','exactBaths','minBaths',
                           'exactSqft','minSqft','maxSqft','minPrice','maxPrice','limit'];
        numFields.forEach(f => {
            if (parsed[f] !== null && parsed[f] !== undefined) {
                const n = Number(parsed[f]);
                parsed[f] = (isNaN(n) || n < 0) ? null : n;  // Reject negatives
            }
        });

        // Edge case: 0 bedrooms/baths is valid for studio apartments
        if (parsed.exactRooms === 0) parsed.exactRooms = 0;  // Allow

        return parsed;

    } catch (err) {
        console.error('⚠️ Groq extraction failed:', err.message);
        return {
            queryType: 'SEARCH',
            language: 'english',
            location: null, propertyType: null, availability: null,
            exactRooms: null, minRooms: null, maxRooms: null,
            exactBaths: null, minBaths: null,
            exactSqft: null, minSqft: null, maxSqft: null,
            minPrice: null, maxPrice: null,
            amenitiesInclude: [], amenitiesExclude: [],
            sortBy: null, limit: null
        };
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// QUERY HANDLERS BY TYPE
// ═════════════════════════════════════════════════════════════════════════════

async function handleGreeting(intent) {
    const greetings = {
        english: `👋 Hello! Welcome to PropX! 🏠\n\nI'm your property assistant. Tell me what you're looking for:\n🏡 "2 bedroom house for rent in DHA"\n🏢 "Cheapest apartment in Karachi"\n🌟 "Biggest villa under 5 crore"`,
        roman_urdu: `👋 Assalamu Alaikum! PropX mein khush amdeed! 🏠\n\nMain aapka property assistant hoon. Batayein kya dhoondh rahe hain:\n🏡 "Rent ke liye 2 bedroom ghar DHA mein"\n🏢 "Karachi mein sabse sasta apartment"\n🌟 "5 crore se kam mein sabse bada villa"`,
        mixed: `👋 Assalamu Alaikum! Welcome to PropX! 🏠\n\nMain aapka property assistant hoon. Tell me what you're looking for:\n🏡 "2 bedroom house for rent in DHA"\n🏢 "Sabse sasta apartment Karachi mein"\n🌟 "Biggest villa under 5 crore"`
    };
    return { success: true, reply: greetings[intent.language] || greetings.mixed };
}

async function handleCount(intent) {
    const query = buildSearchQuery(intent);
    const count = await Property.countDocuments(query);
    
    const replies = {
        english: `📊 I found **${count} properties** matching your criteria.`,
        roman_urdu: `📊 Aapki criteria ke mutabiq **${count} properties** mili hain.`,
        mixed: `📊 I found **${count} properties** aapki criteria ke mutabiq.`
    };
    
    return { success: true, reply: replies[intent.language] || replies.mixed, count };
}

async function handleExtreme(intent) {
    // EXTREME means: most/least expensive, biggest/smallest with limit=1
    const query = buildSearchQuery(intent);
    const sort = buildSort(intent.sortBy || 'price_desc');  // Fallback
    
    const result = await Property.findOne(query)
        .populate('userId', 'name email')
        .sort(sort)
        .lean();

    if (!result) {
        return {
            success: true,
            reply: `😔 Koi property nahi mili matching criteria.\n\n📞 Contact: ${CONTACT.phone}`,
            totalCount: 0
        };
    }

    const extremeType = intent.sortBy === 'price_desc' ? 'most expensive' :
                        intent.sortBy === 'price_asc' ? 'cheapest' :
                        intent.sortBy === 'sqft_desc' ? 'biggest' : 'smallest';

    return {
        success: true,
        reply: `🎯 Here's the ${extremeType} property I found:`,
        results: [formatProperty(result, 'A')],
        totalCount: 1
    };
}

async function handleRecommend(intent) {
    // Recommendation: return diverse mix (rent+buy, different types, price ranges)
    const results = await Property.find({})
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

    const replies = {
        english: `💡 Here are some recommended properties for you:`,
        roman_urdu: `💡 Yahan kuch achhi properties hain aapke liye:`,
        mixed: `💡 Yahan kuch recommended properties hain for you:`
    };

    return {
        success: true,
        reply: replies[intent.language] || replies.mixed,
        results: results.map((p, i) => formatProperty(p, String.fromCharCode(65 + i))),
        totalCount: results.length
    };
}

async function handleSearch(intent) {
    const query = buildSearchQuery(intent);
    const sort = buildSort(intent.sortBy);
    const limit = intent.limit || 10;

    const results = await Property.find(query)
        .populate('userId', 'name email')
        .sort(sort)
        .limit(limit)
        .lean();

    if (results.length === 0) {
        // Fallback: try relaxed search
        const relaxedQuery = buildRelaxedQuery(intent);
        const relaxedResults = await Property.find(relaxedQuery)
            .populate('userId', 'name email')
            .sort(sort)
            .limit(5)
            .lean();

        if (relaxedResults.length === 0) {
            return {
                success: true,
                reply: `😔 Koi property nahi mili.\n\n📞 Contact: ${CONTACT.phone}\n📧 ${CONTACT.email}`,
                totalCount: 0,
                adminContact: CONTACT
            };
        }

        return {
            success: true,
            reply: `🔍 Exact match nahi mila, but yahan similar properties hain:`,
            results: relaxedResults.map((p, i) => formatProperty(p, String.fromCharCode(65 + i))),
            totalCount: relaxedResults.length,
            alternativeSearch: true
        };
    }

    const sortLabel = intent.sortBy === 'price_asc' ? ' (sorted by price low to high)' :
                      intent.sortBy === 'price_desc' ? ' (sorted by price high to low)' :
                      intent.sortBy === 'sqft_desc' ? ' (sorted by size largest first)' :
                      intent.sortBy === 'newest' ? ' (newest listings first)' : '';

    return {
        success: true,
        reply: `🎉 ${results.length} properties found${sortLabel}!\n\n💚 Click "View Full Details" for more info!`,
        results: results.map((p, i) => formatProperty(p, String.fromCharCode(65 + i))),
        totalCount: results.length
    };
}

// ═════════════════════════════════════════════════════════════════════════════
// QUERY BUILDERS
// ═════════════════════════════════════════════════════════════════════════════

function buildSearchQuery(intent) {
    const query = {};
    const andConditions = [];

    // Location (searches both location AND title fields)
    if (intent.location) {
        const patterns = buildLocationPatterns(intent.location);
        if (patterns.length > 0) {
            // Each pattern is {$or: [{location: ...}, {title: ...}]}
            // Wrap all in $or
            query.$or = patterns.flatMap(p => p.$or);
        }
    }

    // Property type
    if (intent.propertyType) {
        query.type = { $regex: `^${intent.propertyType}$`, $options: 'i' };
    }

    // Availability
    if (intent.availability) {
        query.availability = { $regex: `^${intent.availability}$`, $options: 'i' };
    }

    // Bedrooms
    if (intent.exactRooms !== null && intent.exactRooms !== undefined) {
        query.beds = intent.exactRooms;  // Exact (supports 0 for studio)
    } else if (intent.minRooms !== null && intent.maxRooms !== null) {
        query.beds = { $gte: intent.minRooms, $lte: intent.maxRooms };
    } else if (intent.minRooms !== null) {
        query.beds = { $gte: intent.minRooms };
    } else if (intent.maxRooms !== null) {
        query.beds = { $lte: intent.maxRooms };
    }

    // Bathrooms
    if (intent.exactBaths !== null) {
        query.baths = intent.exactBaths;
    } else if (intent.minBaths !== null) {
        query.baths = { $gte: intent.minBaths };
    }

    // Square feet
    if (intent.exactSqft !== null) {
        const tolerance = Math.round(intent.exactSqft * 0.10);
        query.sqft = { $gte: intent.exactSqft - tolerance, $lte: intent.exactSqft + tolerance };
    } else if (intent.minSqft !== null && intent.maxSqft !== null) {
        query.sqft = { $gte: intent.minSqft, $lte: intent.maxSqft };
    } else if (intent.minSqft !== null) {
        query.sqft = { $gte: intent.minSqft };
    } else if (intent.maxSqft !== null) {
        query.sqft = { $lte: intent.maxSqft };
    }

    // Price
    if (intent.minPrice !== null && intent.maxPrice !== null) {
        query.price = { $gte: intent.minPrice, $lte: intent.maxPrice };
    } else if (intent.maxPrice !== null) {
        query.price = { $lte: intent.maxPrice };
    } else if (intent.minPrice !== null) {
        query.price = { $gte: intent.minPrice };
    }

    // Amenities include (AND logic — must have ALL)
    if (intent.amenitiesInclude && intent.amenitiesInclude.length > 0) {
        const resolved = [...new Set(intent.amenitiesInclude.map(resolveAmenity))];
        resolved.forEach(a => {
            andConditions.push({ amenities: { $elemMatch: { $regex: a, $options: 'i' } } });
        });
    }

    // Amenities exclude (AND logic — must NOT have ANY)
    if (intent.amenitiesExclude && intent.amenitiesExclude.length > 0) {
        const resolved = [...new Set(intent.amenitiesExclude.map(resolveAmenity))];
        resolved.forEach(a => {
            andConditions.push({ amenities: { $not: { $elemMatch: { $regex: a, $options: 'i' } } } });
        });
    }

    if (andConditions.length > 0) {
        query.$and = andConditions;
    }

    return query;
}

function buildRelaxedQuery(intent) {
    // Relaxed: only location + type + availability
    const query = {};
    if (intent.location) {
        const patterns = buildLocationPatterns(intent.location);
        if (patterns.length > 0) query.$or = patterns.flatMap(p => p.$or);
    }
    if (intent.propertyType) query.type = { $regex: intent.propertyType, $options: 'i' };
    if (intent.availability) query.availability = { $regex: intent.availability, $options: 'i' };
    return query;
}

function buildSort(sortBy) {
    const sortMap = {
        'price_desc': { price: -1 },
        'price_asc':  { price: 1 },
        'sqft_desc':  { sqft: -1 },
        'sqft_asc':   { sqft: 1 },
        'beds_desc':  { beds: -1 },
        'newest':     { createdAt: -1 },
        'oldest':     { createdAt: 1 },
    };
    return sortMap[sortBy] || { createdAt: -1 };  // Default: newest first
}

function formatProperty(prop, option) {
    return {
        _id: prop._id,
        option,
        title: prop.title,
        type: prop.type,
        availability: prop.availability,
        price: prop.price,
        beds: prop.beds,
        baths: prop.baths,
        sqft: prop.sqft,
        location: prop.location,
        amenities: prop.amenities,
        image: prop.image,
        description: prop.description,
        phone: prop.phone,
    };
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN CHAT HANDLER
// ═════════════════════════════════════════════════════════════════════════════

export const chat = async (req, res) => {
    try {
        const { message, selectedPropertyId } = req.body || {};

        // Detail view
        if (selectedPropertyId) {
            const property = await Property.findById(selectedPropertyId)
                .populate('userId', 'name email')
                .lean();
            if (!property) {
                return res.status(404).json({ success: false, error: 'Property not found' });
            }
            return res.json({
                success: true,
                reply: `📍 Here are the complete details for ${property.title}:`,
                selectedProperty: property,
                isDetailedView: true
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        const text = message.trim();

        // Load locations
        try {
            const locations = await Property.distinct('location');
            availableLocations = locations.filter(loc => loc && loc.trim()).map(loc => loc.toLowerCase());
        } catch (err) {
            console.error('Error loading locations:', err.message);
        }

        // Off-topic check
        if (isOffTopicQuestion(text)) {
            return res.json({
                success: true,
                reply: `😊 Sorry! I'm a real estate assistant and I only help with property-related queries. 🏠\n\n💡 Try asking:\n• "Rent ke liye ghar"\n• "3 bedroom flat"\n• "Sabse sasta apartment"`,
                isGeneralResponse: true
            });
        }

        // Intent extraction
        const intent = await analyzeUserIntent(text);

        // Route by query type
        let response;
        switch (intent.queryType) {
            case 'GREETING':
                response = await handleGreeting(intent);
                break;
            case 'COUNT':
                response = await handleCount(intent);
                break;
            case 'EXTREME':
                response = await handleExtreme(intent);
                break;
            case 'RECOMMEND':
                response = await handleRecommend(intent);
                break;
            case 'INFO':
                response = {
                    success: true,
                    reply: `🤝 I can help you find properties! Just tell me:\n\n📍 **Location** — "in DHA", "Emaar", "Bahria Town"\n🏠 **Type** — House, Apartment, Office, Villa\n💰 **Budget** — "under 50 lakh", "1 crore se zyada"\n🛏️ **Bedrooms** — "2 bedroom", "3 se zyada beds"\n🚿 **Bathrooms** — "2 bathrooms"\n📐 **Size** — "500 sqft", "bari jagah wali"\n🏊 **Amenities** — "with pool", "gym aur parking"\n💎 **Sort** — "cheapest", "biggest", "newest"\n\n📞 Need help? WhatsApp: **${CONTACT.phone}**`
                };
                break;
            default:  // SEARCH
                response = await handleSearch(intent);
                break;
        }

        return res.json(response);

    } catch (err) {
        console.error('❌ Chatbot error:', err);
        return res.status(500).json({ success: false, error: 'Internal error: ' + err.message });
    }
};  