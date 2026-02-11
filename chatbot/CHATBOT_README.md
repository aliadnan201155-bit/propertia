# RoofrBot - Advanced Property Chatbot

## Overview

RoofrBot is an intelligent real estate chatbot powered by **Groq AI (Llama 3.3 70B)** that helps users find properties in Pakistan using natural language queries. It supports multiple languages (English, Urdu, Hinglish) and provides smart responses for various user intents.

---

## AI Integration

### AI Model
- **Provider:** Groq SDK
- **Model:** `llama-3.3-70b-versatile`
- **API Key:** Configured via `GROQ_API_KEY` environment variable

### AI Functions

1. **Smart Response Generation** (`generateSmartResponse`)
2. **Intent Analysis & Filter Extraction** (`analyzeUserIntentWithGroq`)

---

## 💬 EXAMPLE USER PROMPTS FOR ALL FLOWS

### Flow #1: Greeting
**User Examples:**
- "Hi"
- "Hello"
- "Assalam o Alaikum"
- "Hey there"
- "Salam"
- "Suno"
- "Bhai"
- "Start"
- "Begin"

**Bot Response:** Welcome message with available locations

---

### Flow #2: Off-Topic Questions
**User Examples:**
- "Who won the cricket match yesterday?"
- "What's the weather today?"
- "Tell me a joke"
- "What's trending on social media?"
- "Best biryani recipe?"
- "Latest Bollywood movie?"
- "Who is the prime minister?"
- "Play me a song"
- "What should I wear today?"
- "I need a doctor"

**Bot Response:** Polite redirect to real estate topics

---

### Flow #3: General Real Estate Questions
**User Examples:**
- "What is the best area to invest in Karachi?"
- "How do I buy a property in Pakistan?"
- "Tell me about DHA"
- "Why should I invest in real estate?"
- "What is the process of buying a house?"
- "Explain property registration"
- "Which location is better for investment?"
- "Real estate ki kya prices hain?" (Urdu/Hinglish)
- "Property kaise kharidun?" (Urdu)
- "Batao mujhe property ke bare mein" (Urdu)

**Bot Response:** AI-generated helpful answer + redirect to property search

---

### Flow #4: Price/Budget Questions
**User Examples:**
- "What are property prices in DHA?"
- "How expensive are houses in Gulberg?"
- "Cheap properties in Karachi?"
- "Affordable flats under 30 million?"
- "Budget properties in Bahria Town?"
- "Kitne ka milega flat?" (Urdu)
- "Price kya hai properties ki?" (Hinglish)

**Bot Response:** Budget guidance + example search format

---

### Flow #5: Location Questions
**User Examples:**
- "Where can I find properties?"
- "Which areas do you cover?"
- "Available locations?"
- "Tell me about different areas"
- "Kahan kahan properties hain?" (Urdu)
- "Which city properties?"

**Bot Response:** List of available locations from database

---

### Flow #6: Contact/Help Questions
**User Examples:**
- "How can I contact you?"
- "Customer support number?"
- "I need help"
- "Call karna hai" (Urdu)
- "WhatsApp number?"
- "Email address?"
- "Talk to agent"

**Bot Response:** Admin contact information (WhatsApp, Email)

---

### Flow #7: Property Search - Simple Location
**User Examples:**
- "Properties in DHA"
- "Show me houses in Gulberg"
- "Flats in Bahria Town"
- "DHA mein kya hai?" (Urdu)
- "Gulberg properties"
- "Anything in Cantt?"

**Bot Response:** Up to 4 properties in that location

---

### Flow #8: Property Search - Location + Price
**User Examples:**
- "Properties in DHA under 50 million"
- "Houses in Gulberg up to 40 million"
- "Flats under 30M in Bahria Town"
- "DHA mein 50 million ke andar" (Urdu)
- "Cheap houses in Cantt under 25 million"
- "Properties below 60 lac in Faisal Town"

**Bot Response:** Properties matching location and price filter

---

### Flow #9: Property Search - Location + Bedrooms
**User Examples:**
- "3-bedroom house in DHA"
- "2 bedroom flat in Gulberg"
- "4 bed property in Bahria Town"
- "3 BHK in Cantt"
- "2 kamre wala flat DHA mein" (Urdu)
- "5 bedroom house"

**Bot Response:** Properties matching location and bedroom count

---

### Flow #10: Property Search - Complete Filters
**User Examples:**
- "3-bedroom house in DHA under 50 million"
- "2 bedroom flat in Gulberg Phase 5 under 40 million"
- "4-bed villa in Bahria Town under 60M"
- "3 BHK apartment in Khadda Market under 45 million"
- "DHA Phase 8 mein 3 bedroom house 50 million ke andar" (Urdu)
- "Flat in Lucky One Tower 2 bedroom under 35 million"

**Bot Response:** Properties matching all filters (location, bedrooms, price, area)

---

### Flow #11: Property Search - With Area/Sub-location
**User Examples:**
- "Properties in Khadda Market"
- "Flats in DHA Phase 5"
- "House in Bahria Town Phase 8"
- "Apartment in Block A Gulberg"
- "Property in Sector 10"
- "Emaar Crescent Bay mein flat"
- "Lucky One Tower apartments"

**Bot Response:** Properties in specific area/sub-location

---

### Flow #12: Property Search - Property Type Specific
**User Examples:**
- "Flats in DHA"
- "Houses in Gulberg"
- "Apartments in Bahria Town"
- "Villa in Cantt"
- "Flat chahiye DHA mein" (Urdu)
- "House dikhao Gulberg ka" (Urdu)

**Bot Response:** Properties filtered by type (flat/house)

---

### Flow #13: No Exact Match - Alternative Results
**User Examples:**
- "5-bedroom house in DHA" (when only 3-4 bedroom available)
- "10-bedroom mansion in Gulberg" (when not available)
- "1-bedroom in Bahria Town" (when only 2+ available)

**Bot Response:** "No 5-bedroom available, but here are other properties in DHA"

---

### Flow #14: No Results - Contact Admin
**User Examples:**
- "Property in Mars" (invalid location)
- "100-bedroom palace in DHA" (unrealistic)
- "House under 1 million in DHA" (too low price)
- "Properties in New York" (not in database)

**Bot Response:** No results found + admin contact info

---

### Flow #15: Property Detail View
**User Action:** Click "View Details - Option A/B/C/D" button

**Bot Response:** Full property details with all images and owner contact

---

## 🎯 MIXED LANGUAGE EXAMPLES (Urdu/English/Hinglish)

### English
- "3-bedroom house in DHA under 50 million"
- "Show me flats in Gulberg"
- "What properties do you have?"

### Urdu
- "DHA mein 3 kamre ka ghar 50 million ke andar"
- "Gulberg mein flat dikhao"
- "Aap ke paas kya properties hain?"

### Hinglish (Mixed)
- "DHA mein 3-bedroom house under 50 million"
- "Gulberg ka flat chahiye 40M ke andar"
- "Bahria Town mein kya available hai?"
- "Property search karna hai DHA mein"

---

## EXACT PROMPTS FROM CODE

### 🤖 AI Prompt #1: Smart Response Generation

**Function:** `generateSmartResponse(userMessage)`

**Exact Prompt Template:**
```
You are RoofrBot, a friendly Pakistan real estate assistant. 
User asked: "${userMessage}"

Respond in a friendly, helpful way with emojis. Keep it concise (2-3 sentences).
If it's about real estate, mention that you can help with property search in locations: ${availableLocations.join(', ')}.
If it's not about real estate, be helpful but guide them back to property search.
Respond in the same language as the user (Urdu/English/Hinglish mix is fine).
```

**Model Configuration:**
```javascript
{
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  max_completion_tokens: 150,
  top_p: 1
}
```

**Example Input:** `"What is the best area to invest?"`

**Example Prompt Sent to AI:**
```
You are RoofrBot, a friendly Pakistan real estate assistant. 
User asked: "What is the best area to invest?"

Respond in a friendly, helpful way with emojis. Keep it concise (2-3 sentences).
If it's about real estate, mention that you can help with property search in locations: dha, gulberg, bahria town, cantt.
If it's not about real estate, be helpful but guide them back to property search.
Respond in the same language as the user (Urdu/English/Hinglish mix is fine).
```

---

### 🤖 AI Prompt #2: Filter Extraction

**Function:** `analyzeUserIntentWithGroq(userMessage)`

**Exact Prompt Template:**
```
Extract real estate search filters from: "${userMessage}"
Return ONLY valid JSON with no markdown: {"location":"${validLocations}|null", "maxPrice":null, "minRooms":null, "propertyType":"flat|house|null", "area":null}
Use null for missing values, not "null" string.
IMPORTANT: 
- For area, extract sub-locations like "Khadda Market", "Phase 5", "Block A", "Sector", "Market", etc.
- If user mentions a place name that's not in predefined locations, it could be an area/market name - capture it in "area"
- For example: "khadda market" -> set area to "khadda market"
- Extract any geographic identifier user mentions.
```

**Model Configuration:**
```javascript
{
  model: 'llama-3.3-70b-versatile',
  temperature: 0.3,
  max_completion_tokens: 200,
  top_p: 1
}
```

**Example Input:** `"3 bedroom house in DHA under 50 million"`

**Example Prompt Sent to AI:**
```
Extract real estate search filters from: "3 bedroom house in DHA under 50 million"
Return ONLY valid JSON with no markdown: {"location":"dha|gulberg|bahria town|cantt|null", "maxPrice":null, "minRooms":null, "propertyType":"flat|house|null", "area":null}
Use null for missing values, not "null" string.
IMPORTANT: 
- For area, extract sub-locations like "Khadda Market", "Phase 5", "Block A", "Sector", "Market", etc.
- If user mentions a place name that's not in predefined locations, it could be an area/market name - capture it in "area"
- For example: "khadda market" -> set area to "khadda market"
- Extract any geographic identifier user mentions.
```

**Expected AI Response:**
```json
{"location":"dha", "maxPrice":50000000, "minRooms":3, "propertyType":"house", "area":null}
```

---

## EXACT RESPONSE TEMPLATES FROM CODE

### 📝 Response #1: Greeting

**Trigger Regex:** `/\b(hi|hello|hey|assalam|salam|start|begin|kmk|suno|bhai|ji|acha)\b/i`

**Exact Response:**
```
👋 Assalamu Alaikum! Welcome to RoofrBot! 🏠

I'm your friendly property assistant, here to help you find your perfect home! 💚

Tell me what you're looking for:
🏡 *"3-bedroom house in DHA"*
🏢 *"Flat under 50 million in Gulberg"*
🌟 *"2-bed apartment in Bahria Town"*

📍 **Available locations:** ${availableLocations.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}
```

---

### 📝 Response #2: Off-Topic Question

**Detection Function:** `isOffTopicQuestion(text)`

**Off-Topic Keywords Array:**
```javascript
[
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
]
```

**Exact Response:**
```
😊 Sorry! I'm a real estate assistant and I only help with property-related queries. 🏠

I'd be happy to help you find properties in areas like ${availableLocations.slice(0, 3).map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}!

💡 Try asking:
• "3-bedroom house in DHA"
• "Flats under 50 million in Gulberg"
• "Properties in Bahria Town"
```

---

### 📝 Response #3: General Question - Real Estate Related

**Detection Function:** `isGeneralQuestion(text)`

**General Question Keywords:**
```javascript
[
  'what', 'how', 'why', 'when', 'where', 'who', 'tell me', 'explain', 'describe',
  'best', 'good', 'bad', 'better', 'process', 'steps', 'help', 'guide',
  'kya', 'kaisy', 'kyun', 'kahan', 'kiski', 'kitna', 'batao', 'samjhao', 'batain'
]
```

**Fallback Response (Real Estate Keywords Detected):**
```
🏠 Great question about real estate! I'd love to help you with property search!

Tell me what you're looking for:
🏡 *"3-bedroom house in DHA"*
🏢 *"Flat under 50 million in Gulberg"*
🌟 *"Apartment in Bahria Town"*

I can help you find the perfect property! 💚
```

---

### 📝 Response #4: General Question - Price/Budget

**Trigger Regex:** `/price|cost|expensive|cheap|affordable|budget|discount/`

**Exact Response:**
```
💰 That's a smart question! Our properties have various price ranges.

Just tell me your budget and location, and I'll show you amazing options! 🎯

*For example: "Properties in DHA under 50 million"* ✨
```

---

### 📝 Response #5: General Question - Location

**Trigger Regex:** `/where|location|area|city|place|neighborhood/`

**Exact Response:**
```
📍 We have amazing properties in: **${availableLocations.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}**

Just pick a location and tell me what you're looking for! 🌟
```

---

### 📝 Response #6: General Question - Greeting (Fallback)

**Trigger Regex:** `/hi|hello|hey|how are|wassup|kya hal|suno|bhai/`

**Exact Response:**
```
👋 Hello! I'm RoofrBot, your property assistant! 🏠

Ready to help you find an amazing property? Tell me what you're looking for! 💚
```

---

### 📝 Response #7: General Question - Contact/Help

**Trigger Regex:** `/contact|help|support|phone|email|call|whatsapp/`

**Exact Response:**
```
📞 Need help from our team?

📱 **WhatsApp:** 03242952477
📧 **Email:** usamahk9111@gmail.com

Our team is ready to assist you! 😊
```

---

### 📝 Response #8: General Question - Default Fallback

**Exact Response:**
```
🤔 That's an interesting question! But I'm specifically designed to help you find the perfect property. 🏠

Tell me what kind of property you're looking for, and I'll help you find it in seconds! 💚

*Try: "3-bedroom in DHA" or "Flats under 50M in Gulberg"* 🎯
```

---

### 📝 Response #9: Missing Location

**Condition:** `!analyzedFilters.location && !searchByAreaOnly`

**Exact Response:**
```
🤔 I need a location to help you better! ${locationList}

💡 For example: *"Show me 3-bedroom in DHA"* or *"Flats in Gulberg under 50 million"*
```

**Where `locationList` is:**
```
📌 **Choose from these locations:**
${availableLocations.map(loc => `• ${loc.charAt(0).toUpperCase() + loc.slice(1)}`).join('\n')}
```

---

### 📝 Response #10: Properties Found (Success)

**Condition:** `results.length > 0`

**Exact Response:**
```
🎉 Wonderful! I found ${results.length} amazing properties in ${finalLocationDisplay}! Here are your options:

💚 *Click "View Details" to see the complete information, images, and owner details!*
```

**Response Data:**
- Returns up to 4 properties (A, B, C, D)
- Each property includes: `_id`, `option`, `title`, `price`, `rooms`, `type`, `area`, `images`, `description`

---

### 📝 Response #11: No Exact Match - Alternative Results

**Condition:** `results.length === 0 && analyzedFilters.minRooms && alternativeResults.length > 0`

**Exact Response:**
```
😢 Oops! We don't have a ${analyzedFilters.minRooms}-bedroom property available in ${locationDisplay} right now, but don't worry! New listings come every day! 🎉

✨ But here's some good news! I found ${alternativeResults.length} other amazing properties in ${locationDisplay} that might interest you! Would you like to check them out? 👀

```

**Response Data:**
- Returns up to 5 alternative properties (A, B, C, D, E)
- `alternativeSearch: true`
- `hasExactMatch: false`

---

### 📝 Response #12: No Results - Contact Admin

**Condition:** `results.length === 0 && alternativeResults.length === 0`

**Exact Response:**
```
🏠 Hmm, we couldn't find exactly what you're looking for in ${locationText} right now.

💡 **But don't lose hope!** Our amazing team is constantly adding new properties! 🚀

📞 **Get personalized help from our experts:**

📱 WhatsApp: **03242952477**
📧 Email: **usamahk9111@gmail.com**

Just tell them what you're looking for, and they'll find the perfect property for you within 24 hours! They're super friendly and always ready to help. 😊✨
```

**Response Data:**
```javascript
{
  success: true,
  reply: reply,
  totalCount: 0,
  hasExactMatch: false,
  searchFilters: analyzedFilters,
  adminContact: {
    email: 'usamahk9111@gmail.com',
    phone: '03242952477'
  }
}
```

---

### 📝 Response #13: Property Detail View

**Condition:** `selectedPropertyId` provided in request

**Exact Response:**
```
📍 Here are the complete details for **${property.title}**:
```

**Response Data:**
```javascript
{
  success: true,
  reply: `📍 Here are the complete details for **${property.title}**:`,
  selectedProperty: property,  // Full property object with owner details
  isDetailedView: true
}
```

---

## FALLBACK FILTER EXTRACTION (Regex Patterns)

When AI fails, the system uses regex-based extraction:

### Location Extraction
```javascript
// Matches against available locations from database
for (const loc of availableLocations) {
  const pattern = new RegExp(`\\b${loc.replace(/\s+/g, '\\s+')}\\b`, 'i');
  if (pattern.test(lower)) {
    filters.location = loc;
    break;
  }
}
```

### Price Extraction
```javascript
// Pattern: /(\d+)\s*(?:million|m|lac|lakh|k)/i
const priceMatch = lower.match(/(\d+)\s*(?:million|m|lac|lakh|k)/i);

// Conversions:
if (/million|m/i.test(priceMatch[0])) {
  filters.maxPrice = amount * 1000000;
} else if (/lac|lakh/i.test(priceMatch[0])) {
  filters.maxPrice = amount * 100000;
} else if (/k/i.test(priceMatch[0])) {
  filters.maxPrice = amount * 1000;
}
```

**Examples:**
- "50 million" → 50,000,000
- "5 lac" → 500,000
- "100k" → 100,000

### Bedrooms Extraction
```javascript
// Pattern: /(\d+)\s*(?:bedroom|room|bed|bhk)/i
const roomsMatch = lower.match(/(\d+)\s*(?:bedroom|room|bed|bhk)/i);
if (roomsMatch) {
  filters.minRooms = parseInt(roomsMatch[1]);
}
```

**Examples:**
- "3-bedroom" → 3
- "2 rooms" → 2
- "4 bed" → 4
- "2 bhk" → 2

### Property Type Extraction
```javascript
// Flat detection
if (/\bflat\b|\bapartment\b|\bapt\b/.test(lower)) {
  filters.propertyType = 'flat';
}

// House detection
if (/\bhouse\b|\bvilla\b/.test(lower)) {
  filters.propertyType = 'house';
}
```

### Area/Sub-location Patterns
```javascript
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
```

**Examples:**
- "Khadda Market" → area: "khadda market"
- "Phase 5" → area: "phase 5"
- "Block A" → area: "block a"
- "Sector 10" → area: "sector 10"

---

## Search Response Cases

### Case 1: Missing Location

**Condition:** No location extracted and no area specified

**Response:**
```
🤔 I need a location to help you better! 

📌 **Choose from these locations:**
• [Dynamic location list from database]

💡 For example: *"Show me 3-bedroom in DHA"* or *"Flats in Gulberg under 50 million"*
```

---

### Case 2: Exact Match Found

**Condition:** Properties found matching all filters

**Response:**
```
🎉 Wonderful! I found {count} amazing properties in {location}! Here are your options:

💚 *Click "View Details" to see the complete information, images, and owner details!*
```

**Returns:** Up to 4 properties (A, B, C, D) with:
- Property ID
- Title
- Price
- Rooms
- Type
- Area
- Images
- Description

---

### Case 3: No Exact Match - Alternative Results

**Condition:** No results with room filter, but results exist without it

**Response:**
```
😢 Oops! We don't have a {minRooms}-bedroom property available in {location} right now, but don't worry! New listings come every day! 🎉

✨ But here's some good news! I found {count} other amazing properties in {location} that might interest you! Would you like to check them out? 👀
```

**Returns:** Up to 5 alternative properties (A, B, C, D, E)

---

### Case 4: No Results at All

**Condition:** No properties found even with relaxed filters

**Response:**
```
🏠 Hmm, we couldn't find exactly what you're looking for in {location} right now.

💡 **But don't lose hope!** Our amazing team is constantly adding new properties! 🚀

📞 **Get personalized help from our experts:**

📱 WhatsApp: **03242952477**
📧 Email: **usamahk9111@gmail.com**

Just tell them what you're looking for, and they'll find the perfect property for you within 24 hours! They're super friendly and always ready to help. 😊✨
```

**Returns:** Admin contact information

---

### Case 5: Property Detail View

**Trigger:** `selectedPropertyId` provided in request

**Response:**
```
📍 Here are the complete details for **{property.title}**:
```

**Returns:** Complete property object with:
- All images
- Owner details (email, fullName, phone)
- Full description
- All property attributes

---

## Database Integration

### Available Locations
- Dynamically loaded from MongoDB on each request
- Query: `Property.distinct('location')`
- Normalized to lowercase for matching

### Property Search Query
```javascript
{
  location: string (lowercase),
  price: { $lte: maxPrice },
  rooms: { $gte: minRooms },
  type: "flat" | "house",
  area: RegExp (case-insensitive)
}
```

### Search Strategy
1. **Primary Search:** All filters applied
2. **Alternative Search:** Remove room filter if no results
3. **Fallback:** Show contact info if still no results

---

## API Endpoint

**POST** `/api/chatbot`

### Request Body (Search):
```json
{
  "message": "3-bedroom house in DHA under 50 million"
}
```

### Request Body (Property Details):
```json
{
  "selectedPropertyId": "property_id_here"
}
```

### Response Format:
```json
{
  "success": true,
  "reply": "Bot response message",
  "results": [
    {
      "_id": "property_id",
      "option": "A",
      "title": "Property Title",
      "price": 45000000,
      "rooms": 3,
      "type": "house",
      "area": "DHA Phase 5",
      "images": ["url1", "url2"],
      "description": "Full description"
    }
  ],
  "totalCount": 10,
  "searchFilters": {
    "location": "dha",
    "maxPrice": 50000000,
    "minRooms": 3,
    "propertyType": "house",
    "area": null
  },
  "isGeneralResponse": false,
  "alternativeSearch": false,
  "hasExactMatch": true
}
```

---

## Example User Queries

### Simple Location Search:
- "Properties in Gulberg"
- "Show me houses in DHA"
- "Flats in Bahria Town"

### With Price Filter:
- "3-bedroom in Gulberg under 50 million"
- "Properties in DHA up to 40 million"
- "Houses under 60M in Cantt"

### With Area and Rooms:
- "2-bedroom house in DHA Phase 5"
- "3-bedroom flat in Bahria Town under 45 million"
- "Apartment in Khadda Market"

### General Questions:
- "What is the best area to invest?"
- "How do I buy a property?"
- "Tell me about DHA"

### Greetings:
- "Hi", "Hello", "Assalam o Alaikum"
- "Suno", "Bhai", "Hey"

---

## Technical Details

### Environment Variables
```bash
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=your_mongodb_connection_string
PORT=8000
```

### Dependencies
- `groq-sdk` - AI integration
- `mongoose` - MongoDB ORM
- `express` - Web framework

### Error Handling
- AI failures fall back to regex-based extraction
- Database errors logged and handled gracefully
- User-friendly error messages displayed

---

## Files Structure

```
/src/controllers/chatbot.controller.js  - Main chatbot logic
/src/routes/chatbot.routes.js          - API routes
/public/test-chatbot.html              - Test interface
/CHATBOT_README.md                     - This documentation
```

---

## Testing

### Local Testing
1. Start server: `npm run dev`
2. Open: `http://localhost:8000/test-chatbot.html`
3. Try different queries

### API Testing
```bash
curl -X POST http://localhost:8000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"3 bedroom in DHA"}'
```

---

## Contact Information

**Support Team:**
- 📱 WhatsApp: 03242952477
- 📧 Email: usamahk9111@gmail.com

---

## Version History

- **v2.0** - Groq AI integration with smart responses
- **v1.5** - Multi-filter search with area support
- **v1.0** - Basic property search functionality
