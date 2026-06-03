const CHATBOT_API_URL = '/api/chatbot';

/**
 * Sends a message to the chatbot backend and gets a response.
 * @param message The user's message.
 * @returns A promise that resolves to the chatbot's answer.
 */
export const sendMessageToBot = async (message: string): Promise<string> => {
    const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to communicate with the chatbot.');
    }

    const data = await response.json();
    return data.answer;
};
