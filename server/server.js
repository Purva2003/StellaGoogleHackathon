import express from 'express';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const PROJECT_ID = "stella-extension";
const LOCATION = "us-central1";
const MODEL = "gemini-1.5-flash";

// Token cache
let cachedToken = null;

/**
 * Get OAuth 2.0 access token using service account
 */
async function getAccessToken() {
  try {
    // Check if we have a valid cached token
    if (cachedToken && Date.now() < cachedToken.expiry) {
      console.log('Using cached access token');
      return cachedToken.token;
    }

    console.log('Generating new access token...');

    // Create GoogleAuth client with service account credentials
    const auth = new GoogleAuth({
      keyFile: join(__dirname, 'service-account.json'),
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();

    if (!tokenResponse.token) {
      throw new Error('Failed to get access token');
    }

    // Cache the token (expires in 1 hour, refresh 5 minutes before)
    cachedToken = {
      token: tokenResponse.token,
      expiry: Date.now() + 55 * 60 * 1000 // 55 minutes
    };

    console.log('Access token generated successfully');
    return tokenResponse.token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error(`Failed to get access token: ${error.message}`);
  }
}

/**
 * Call Vertex AI Gemini API
 */
async function callVertexAI(prompt) {
  try {
    const accessToken = await getAccessToken();

    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

    console.log('Calling Vertex AI endpoint:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vertex AI API error:', response.status, errorText);
      throw new Error(`Vertex AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Vertex AI response received');

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

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stella AI Server is running' });
});

app.post('/api/vertex-ai', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log('Received Vertex AI request:', prompt);

    const result = await callVertexAI(prompt);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in /api/vertex-ai:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stella AI Server running on http://localhost:${PORT}`);
  console.log(`📡 Vertex AI endpoint: http://localhost:${PORT}/api/vertex-ai`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
