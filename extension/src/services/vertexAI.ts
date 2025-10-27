/**
 * Vertex AI Service - Frontend
 *
 * This service communicates with the local Node.js server
 * which handles Vertex AI authentication and API calls.
 *
 * The service account credentials are stored securely on the server
 * and never exposed to the frontend or extension.
 */

const SERVER_URL = 'http://localhost:3000';

interface VertexAIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export async function searchVertexAI(query: string): Promise<string> {
  try {
    if (!query || !query.trim()) {
      throw new Error('Query cannot be empty');
    }

    console.log('Sending Vertex AI request to server...');

    // Call local Node.js server API
    const response = await fetch(`${SERVER_URL}/api/vertex-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: query
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data: VertexAIResponse = await response.json();

    console.log('Received response from server:', data);

    if (data.success && data.data) {
      return data.data;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error('No response from Vertex AI');
    }
  } catch (error) {
    console.error('Vertex AI Error:', error);

    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Make sure the server is running on http://localhost:3000');
      }
      throw error;
    }

    throw new Error('Failed to communicate with Vertex AI service');
  }
}
