// Gemini API Integration for AI-powered text summarization and explanations

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Generate AI summary using Gemini API
 */
export async function summarizeText(text: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('No text provided for summarization');
  }

  // Limit text length to avoid token limits
  const maxLength = 10000;
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  const prompt = `Summarize the following text in a clear and concise manner (100-150 words).
Focus on the main points and key takeaways:

${truncatedText}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    const summary = data.candidates[0].content.parts[0].text;
    return summary;

  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate summary. Please try again.');
  }
}

/**
 * Generate detailed explanation using Gemini API
 */
export async function explainText(text: string, mode: 'simple' | 'technical' = 'simple'): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const prompts = {
    simple: `Explain the following text in simple terms, as if explaining to a beginner. Use clear language and examples:

${text}`,
    technical: `Provide a detailed technical explanation of the following text. Include technical details, context, and deeper insights:

${text}`
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompts[mode]
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Gemini Explanation Error:', error);
    throw new Error('Failed to generate explanation');
  }
}

/**
 * Extract keywords from text for better search queries
 */
export async function extractKeywords(text: string): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    // Fallback to simple keyword extraction
    return text.split(' ').slice(0, 5);
  }

  const prompt = `Extract 3-5 key search terms from this text. Return only the keywords separated by commas:

${text.substring(0, 500)}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to extract keywords');
    }

    const data: GeminiResponse = await response.json();
    const keywordsText = data.candidates[0].content.parts[0].text;

    // Parse keywords from response
    return keywordsText.split(',').map(k => k.trim()).filter(k => k.length > 0);

  } catch (error) {
    console.error('Keyword extraction error:', error);
    // Fallback to simple extraction
    return text.split(' ').filter(word => word.length > 3).slice(0, 5);
  }
}
