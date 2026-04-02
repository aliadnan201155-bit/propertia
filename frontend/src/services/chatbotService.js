const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/chatbot`;

export const sendChatMessage = async (message) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Chatbot API Error:', error);
        throw error;
    }
};
