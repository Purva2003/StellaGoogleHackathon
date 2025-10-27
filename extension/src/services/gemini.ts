/**
 * Gemini AI Service
 *
 * This service calls Google Gemini API directly using an API key.
 * No server required - all calls are made from the extension.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function searchGemini(query: string): Promise<string> {
  try {
    if (!query || !query.trim()) {
      throw new Error('Query cannot be empty');
    }

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    console.log('Sending Gemini API request...');

    // Call Gemini API directly
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: query
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Received Gemini response');

    // Extract text from Gemini response
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    return 'No response from Gemini AI';
  } catch (error) {
    console.error('Gemini AI Error:', error);

    // Provide more helpful error messages
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to communicate with Gemini AI service');
  }
}
