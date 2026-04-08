// frontend/src/services/chatbotService.js

// ⚠️ Yahan humne 4000 kar diya hai kyunke aapka server.js 4000 par hai
const BACKEND_URL = 'http://localhost:4000'; 

export const sendChatMessage = async (payload) => {
  try {
    const bodyData = typeof payload === 'string' ? { message: payload } : payload;

    const response = await fetch(`${BACKEND_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chat API Error:", error);
    // Crash se bachne ke liye hum ek proper object bhej rahe hain
    return { success: false, error: "Connection failed. Please check backend server." }; 
  }
};