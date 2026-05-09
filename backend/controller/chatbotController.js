import Property from '../models/propertymodel.js';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

let availableLocations = []; // Will be populated from DB

// ── NEW: Amenity synonym map ──────────────────────────────────────────────────
// Canonical name → all keywords/synonyms that should match it
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

// ── NEW: Resolve user keyword → canonical amenity name ───────────────────────
function resolveAmenity(keyword) {
    const lower = keyword.toLowerCase().trim();
    for (const [canonical, synonyms] of Object.entries(AMENITY_MAP)) {
        if (synonyms.some(s => s.includes(lower) || lower.includes(s))) {
            return canonical;
        }
    }
    return lower; // Return as-is if no synonym match
}

/**
 * Build an array of $or location regex patterns from a user's location string.
 *
 * Handles all spacing/casing variations so that:
 *   "luckyone"  → also matches "lucky one", "Lucky One", "lucky-one"
 *   "lucky one" → also matches "luckyone", "LuckyOne", "lucky-one"
 *   "emaar"     → matches "Emaar Crescent Bay Karachi" and any emaar listing
 *
 * Returns an array ready to drop into a MongoDB $or clause.
 */
function buildLocationPatterns(locationStr) {
    const lower = locationStr.trim().toLowerCase();
    const patterns = new Set();

    // 1. Original string — direct match
    patterns.add(lower);

    // 2. All spaces removed → "lucky one" becomes "luckyone"
    //    Catches joined variants when user typed spaced version
    const noSpaces = lower.replace(/\s+/g, '');
    if (noSpaces !== lower) patterns.add(noSpaces);

    // 3. Spaces made flexible → "lucky one" becomes regex "lucky[\s\-]*one"
    //    Catches: "luckyone", "lucky one", "lucky-one" in one pattern
    if (lower.includes(' ')) {
        patterns.add(lower.replace(/\s+/g, '[\\s\\-]*'));
    }

    // 4. Character-level optional separators for single compound words
    //    "luckyone" → "l[\s\-]?u[\s\-]?c[\s\-]?k[\s\-]?y[\s\-]?o[\s\-]?n[\s\-]?e"
    //    Catches: "luckyone", "lucky one", "lucky-one", "Lucky One" all in one shot
    if (!lower.includes(' ') && lower.length <= 25) {
        patterns.add(lower.split('').join('[\\s\\-]?'));
    }

    // 5. Each individual significant word (length > 2) for broad partial matching
    //    "emaar crescent bay" → also tries ["emaar", "crescent", "bay"] individually
    const words = lower.split(/\s+/).filter(w => w.length > 2);
    words.forEach(w => patterns.add(w));

    // Return as MongoDB $or-ready condition array
    return [...patterns].map(p => ({ location: { $regex: p, $options: 'i' } }));
}

/**
 * Domain restriction — Level 1.
 * Catches known off-topic categories before Groq is ever called.
 * Expanded to cover: world news, public figures, current events, and all
 * non-real-estate domains so they never reach the filter pipeline.
 */
function isOffTopicQuestion(text) {
    const lower = text.toLowerCase();

    // World / current events triggers — catches "what is trump doing", "latest news" etc.
    const newsAndPeoplePhrases = [
        /\btrump\b/, /\bbiden\b/, /\bmodi\b/, /\bimran\b/, /\bzardari\b/,
        /\bnews\b/, /\bbreaking\b/, /\blatest\b.*\bnews\b/, /\btoday.*news\b/,
        /\bwhat is.*doing\b/, /\bwhat did.*say\b/, /\bwho is.*president\b/,
        /\bwho is.*prime minister\b/, /\bcurrent.*affairs\b/, /\bworld.*news\b/,
        /\bstock market\b/, /\bshare price\b/, /\bdollar rate\b/, /\busd.*pkr\b/,
        /\bcrypto\b/, /\bbitcoin\b/, /\bwar\b/, /\bconflict\b/,
    ];
    if (newsAndPeoplePhrases.some(rx => rx.test(lower))) return true;

    // Keyword-based off-topic categories
    const offTopicKeywords = [
        // Entertainment
        'drama', 'movie', 'film', 'actor', 'actress', 'celebrity', 'trending', 'viral',
        'netflix', 'youtube', 'tiktok', 'instagram', 'twitter', 'facebook',
        // Sports
        'cricket', 'football', 'soccer', 'sports', 'match', 'player', 'tournament',
        'fifa', 'psl', 'ipl', 'worldcup', 'olympics',
        // Food
        'recipe', 'food', 'cooking', 'dish', 'restaurant', 'biryani', 'pizza',
        // Weather
        'weather', 'temperature', 'rain', 'sunny', 'forecast', 'humidity',
        // Comedy / misc
        'joke', 'funny', 'meme', 'comedy', 'prank',
        // Politics (generic)
        'politics', 'election', 'government', 'minister', 'parliament', 'vote',
        // Music
        'music', 'song', 'singer', 'album', 'concert', 'lyrics',
        // Fashion
        'fashion', 'clothes', 'dress', 'style', 'outfit', 'makeup',
        // Health
        'health', 'doctor', 'medicine', 'hospital', 'disease', 'symptoms', 'treatment',
        // Education
        'school', 'college', 'university', 'education', 'degree', 'exam', 'admission',
        // Vehicles
        'car', 'bike', 'vehicle', 'transport', 'motorcycle', 'truck',
        // Tech / unrelated
        'iphone', 'android', 'laptop', 'gaming', 'software', 'coding',
    ];

    return offTopicKeywords.some(keyword =>
        new RegExp(`\\b${keyword}\\b`, 'i').test(lower)
    );
}

// ── DOMAIN RESTRICTION — Level 2 ────────────────────────────────────────────
// isGeneralQuestion, generateSmartResponse, and generateSmartFallbackResponse
// have been REMOVED. They routed any message to an unrestricted Groq prompt
// which freely answered world questions ("what is trump doing today" etc.).
//
// Now all non-property queries are caught by two gates:
//   Gate 1 — isOffTopicQuestion() above (known off-topic keyword/pattern match)
//   Gate 2 — hasAnyFilter check below (if Groq extracts zero property filters → reject)
//
// Valid property queries that use question words ("what apartments are in DHA?")
// still work correctly because Groq extracts real filters from them.

/**
 * Fallback filter extraction using regex patterns (Safety net if AI fails)
 */
function parseFallbackFilters(text) {
    const lower = text.toLowerCase();
    const filters = {
        location: null, area: null, maxPrice: null, minPrice: null,
        exactRooms: null, minRooms: null,
        exactBaths: null, minBaths: null,       // NEW: split into exact vs min
        propertyType: null, availability: null,
        exactSqft: null, minSqft: null,         // NEW: split into exact vs min
        amenities: []                            // NEW
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

    // FIX: was parseInt(roomsMatch) — missing [1], was parsing full array string
    const roomsMatch = lower.match(/(\d+)\s*(?:bedroom|room|bed|bhk)/i);
    if (roomsMatch) {
        if (/zyada|more|above|plus|\+/.test(lower)) {
            filters.minRooms = parseInt(roomsMatch[1]) + 1;
        } else {
            filters.exactRooms = parseInt(roomsMatch[1]); // FIX: [1] not [0]
        }
    }

    // NEW: Bathrooms fallback
    const bathsMatch = lower.match(/(\d+)\s*(?:bathroom|bath|washroom)/i);
    if (bathsMatch) {
        if (/zyada|more|above|plus|\+/.test(lower)) {
            filters.minBaths = parseInt(bathsMatch[1]) + 1;
        } else {
            filters.exactBaths = parseInt(bathsMatch[1]);
        }
    }

    // NEW: Sqft fallback
    const sqftMatch = lower.match(/(\d+)\s*(?:sqft|sq\.?\s*ft|square\s*feet)/i);
    if (sqftMatch) {
        if (/zyada|more|above|plus|\+/.test(lower)) {
            filters.minSqft = parseInt(sqftMatch[1]);
        } else {
            filters.exactSqft = parseInt(sqftMatch[1]);
        }
    }

    // NEW: Amenities fallback — check each synonym against the message
    const foundAmenities = [];
    for (const [canonical, synonyms] of Object.entries(AMENITY_MAP)) {
        if (synonyms.some(s => lower.includes(s))) {
            foundAmenities.push(canonical);
        }
    }
    filters.amenities = foundAmenities;

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

        // UPDATED: Prompt now includes amenities, exact/min split for baths & sqft
        const prompt = `You are an intelligent real estate search parser that understands English and Roman Urdu (e.g. "se zyada", "rent ke liye"). Extract filters from this query: "${safeMessage}"

Known locations (partial match is fine): ${locationSample}

Return ONLY this JSON (no markdown, no extra text):
{
  "location": null,
  "area": null,
  "maxPrice": null,
  "minPrice": null,
  "exactRooms": null,
  "minRooms": null,
  "exactBaths": null,
  "minBaths": null,
  "propertyType": null,
  "availability": null,
  "exactSqft": null,
  "minSqft": null,
  "amenities": []
}

Rules:
- location: partial name is fine. "emaar" → "emaar". null if not mentioned.
- area: sub-area like Phase 5 / Block A, or null.
- exactRooms: INTEGER. Set ONLY when user says "2 bedroom", "2 bed", "2 bhk". Do NOT also set minRooms.
- minRooms: INTEGER. Set ONLY when user says "more than 2", "2 se zyada", "at least 3", "3+". Do NOT also set exactRooms.
- exactBaths: INTEGER. Set ONLY for exact count e.g. "2 bathrooms". Do NOT also set minBaths.
- minBaths: INTEGER. Set ONLY when user says "more than 2 baths", "2 se zyada washroom". Do NOT also set exactBaths.
- exactSqft: INTEGER. Set ONLY for exact size e.g. "410 sqft". Do NOT also set minSqft.
- minSqft: INTEGER. Set ONLY when user says "more than 500 sqft", "500 se zyada". Do NOT also set exactSqft.
- maxPrice: NUMBER in PKR. "50 lakh"=5000000, "1 crore"=10000000, "50M"=50000000. Use for "under X", "below X".
- minPrice: NUMBER in PKR. Use for "above X", "more than X price".
- propertyType: exactly "House", "Apartment", "Office", or "Villa". "flat"→"Apartment", "ghar"→"House". null if not mentioned.
- availability: "rent" or "buy" only. "kiraya"→"rent", "kharidna"→"buy". null if not mentioned.
- amenities: ARRAY of raw keywords user mentioned e.g. ["pool", "gym", "theater"]. [] if none mentioned.`;

        const message = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_completion_tokens: 200,
            top_p: 1
        });

        // FIX: was message.choices?.message — choices is an array, need [0]
        let responseText = message.choices[0]?.message?.content || '';
        responseText = responseText.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) throw new Error('No JSON object found in response');

        const parsed = JSON.parse(jsonMatch[0]);

        // Sanitize: string "null" / "" / "undefined" → actual null
        Object.keys(parsed).forEach(k => {
            if (parsed[k] === 'null' || parsed[k] === '' || parsed[k] === 'undefined') {
                parsed[k] = k === 'amenities' ? [] : null;
            }
        });

        // Ensure amenities is always an array
        if (!Array.isArray(parsed.amenities)) parsed.amenities = [];

        // Type-coerce all numeric fields — prevents string vs number mismatch in MongoDB
        const numericFields = ['exactRooms','minRooms','exactBaths','minBaths',
                               'exactSqft','minSqft','minPrice','maxPrice'];
        numericFields.forEach(f => {
            if (parsed[f] !== null && parsed[f] !== undefined) {
                const n = Number(parsed[f]);
                parsed[f] = isNaN(n) ? null : n;
            }
        });

        // Smart merge: Groq only overrides fallback when it actually found a value
        const merged = { ...fallbackFilters };
        Object.keys(parsed).forEach(key => {
            if (key === 'amenities') {
                // Merge amenities from both sources (deduplicated + resolved)
                const combined = [...new Set([
                    ...fallbackFilters.amenities,
                    ...parsed.amenities.map(resolveAmenity)
                ])];
                merged.amenities = combined;
            } else if (parsed[key] !== null && parsed[key] !== undefined) {
                merged[key] = parsed[key];
            }
        });

        return merged;

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
                        reply: `📍 Here are the complete details for ${property.title}:`,
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
        if (/\b(hy|hai|hey|hi|hello|hey|assalam|salam|start|begin|kmk|suno|bhai|ji|acha)\b/i.test(text)) {
            return res.json({
                success: true,
                reply: `👋 Assalamu Alaikum! Welcome to PropX! 🏠\n\nI'm your friendly property assistant. Tell me what you're looking for:\n🏡 "Rent ke liye Apartment"\n🏢 "3 beds se zyada wala ghar"\n🌟 "DHA mein property under 50M"`
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

        // Analyze Intent
        const analyzedFilters = await analyzeUserIntentWithGroq(text);

        // Check if ANY filter is applied — UPDATED to include new fields
        const hasAnyFilter = analyzedFilters.location || analyzedFilters.area ||
                             analyzedFilters.maxPrice || analyzedFilters.minPrice ||
                             analyzedFilters.exactRooms || analyzedFilters.minRooms ||
                             analyzedFilters.exactBaths || analyzedFilters.minBaths ||
                             analyzedFilters.exactSqft || analyzedFilters.minSqft ||
                             analyzedFilters.propertyType || analyzedFilters.availability ||
                             (analyzedFilters.amenities && analyzedFilters.amenities.length > 0);

        if (!hasAnyFilter) {
            return res.json({
                success: true,
                reply: `🤔 Main samajh nahi paya. Aap kis tarah ki property dhoondh rahe hain?\n\n💡 Try karein: "Rent ke liye Apartment", "3 bedroom house", ya "DHA mein property"`
            });
        }

        // Build Smart DB Query
        const query = {};

        // UPDATED: All location variants fed into $or so "luckyone" matches "lucky one" and vice versa
        if (analyzedFilters.location) {
            query.$or = buildLocationPatterns(analyzedFilters.location);
        } else if (analyzedFilters.area) {
            query.$or = buildLocationPatterns(analyzedFilters.area);
        }

        if (analyzedFilters.maxPrice && analyzedFilters.minPrice) {
            query.price = { $gte: analyzedFilters.minPrice, $lte: analyzedFilters.maxPrice };
        } else if (analyzedFilters.maxPrice) {
            query.price = { $lte: analyzedFilters.maxPrice };
        } else if (analyzedFilters.minPrice) {
            query.price = { $gte: analyzedFilters.minPrice };
        }

        // UPDATED: exactRooms = strict integer match, minRooms = $gte
        if (analyzedFilters.exactRooms !== null && analyzedFilters.exactRooms !== undefined) {
            query.beds = analyzedFilters.exactRooms;
        } else if (analyzedFilters.minRooms !== null && analyzedFilters.minRooms !== undefined) {
            query.beds = { $gte: analyzedFilters.minRooms };
        }

        // UPDATED: Bathrooms now support exact vs min (was always $gte before)
        if (analyzedFilters.exactBaths !== null && analyzedFilters.exactBaths !== undefined) {
            query.baths = analyzedFilters.exactBaths;
        } else if (analyzedFilters.minBaths !== null && analyzedFilters.minBaths !== undefined) {
            query.baths = { $gte: analyzedFilters.minBaths };
        }

        // UPDATED: exactSqft uses ±10% tolerance range, minSqft uses $gte
        if (analyzedFilters.exactSqft !== null && analyzedFilters.exactSqft !== undefined) {
            const tolerance = Math.round(analyzedFilters.exactSqft * 0.10);
            query.sqft = {
                $gte: analyzedFilters.exactSqft - tolerance,
                $lte: analyzedFilters.exactSqft + tolerance
            };
        } else if (analyzedFilters.minSqft !== null && analyzedFilters.minSqft !== undefined) {
            query.sqft = { $gte: analyzedFilters.minSqft };
        }

        if (analyzedFilters.propertyType && analyzedFilters.propertyType !== 'null') {
            query.type = { $regex: analyzedFilters.propertyType, $options: 'i' };
        }
        if (analyzedFilters.availability && analyzedFilters.availability !== 'null') {
            query.availability = { $regex: analyzedFilters.availability, $options: 'i' };
        }

        // NEW: Amenities — resolve synonyms then require ALL of them (AND logic)
        if (analyzedFilters.amenities && analyzedFilters.amenities.length > 0) {
            const resolved = [...new Set(analyzedFilters.amenities.map(resolveAmenity))];
            query.$or = resolved.map(amenity => ({
                amenities: { $elemMatch: { $regex: amenity, $options: 'i' } }
            }));
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

            // UPDATED: Same multi-variant matching in fallback search
            if (analyzedFilters.location) {
                alternativeQuery.$or = buildLocationPatterns(analyzedFilters.location);
            }
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
                    beds: prop.beds, baths: prop.baths, sqft: prop.sqft,
                    type: prop.type, image: prop.image, description: prop.description, phone: prop.phone
                }));

                return res.json({
                    success: true, reply: reply, results: altProps, totalCount: altProps.length,
                    alternativeSearch: true, searchFilters: analyzedFilters
                });
            }

            reply += `📞 Get personalized help from our experts:\n📱 WhatsApp: +92 (021) 567-567\n📧 Email: support@propertia.com\n\nHamari team aapki madad ke liye hamesha tayar hai! 😊✨`;

            return res.json({
                success: true, reply: reply, totalCount: 0, hasExactMatch: false,
                adminContact: { email: 'support@propertia.com', phone: '+92 (021) 567-567' }
            });
        }

        // Format exact results
        const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const displayResults = results.slice(0, 10).map((prop, idx) => ({
            _id: prop._id, option: options[idx], title: prop.title, price: prop.price,
            beds: prop.beds, baths: prop.baths, sqft: prop.sqft,
            type: prop.type, image: prop.image, description: prop.description,
            phone: prop.phone, amenities: prop.amenities  // NEW: amenities included in response
        }));

        const aiResponse = `🎉 Zabardast! Mujhe aapki requirement ke mutabiq ${results.length} properties mili hain! Ye rahe options:\n\n💚 Click "View Full Details" to see more information!`;

        return res.json({
            success: true, reply: aiResponse, results: displayResults, totalCount: results.length
        });

    } catch (err) {
        console.error('Chatbot error:', err);
        return res.status(500).json({ success: false, error: 'Internal error: ' + err.message });
    }
};

