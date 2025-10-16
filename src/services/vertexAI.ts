
const API_KEY = import.meta.env.VITE_VERTEX_AI_API_KEY;
const PROJECT_ID = import.meta.env.VITE_VERTEX_AI_PROJECT_ID;
const LOCATION = import.meta.env.VITE_VERTEX_AI_LOCATION || 'us-central1';

export async function searchVertexAI(query: string): Promise<string> {
  try {
    if (!API_KEY || !PROJECT_ID) {
      throw new Error('Vertex AI API key or Project ID not configured');
    }

    // Using Vertex AI's Gemini API
    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-pro:streamGenerateContent`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `Provide a brief, informative answer about: ${query}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vertex AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Extract text from Vertex AI response
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    return 'No response from Vertex AI';
  } catch (error) {
    console.error('Vertex AI Error:', error);
    throw error;
  }
}
