import fetch from 'node-fetch';

// To allow easy mocking in test
export const deps = { fetch };

export class GeminiError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}

class Gemini {
  constructor({ apiKey, maxTokens, model }) {
    this.apiKey = apiKey;
    this.maxTokens = maxTokens || 65536;
    this.model = model || 'gemini-2.5-pro-exp-03-25';
  }

  async converse(messages, system = '') {
    const payload = {
      contents: [
        ...(system ? [{ role: 'system', parts: [{ text: system }] }] : []),
        ...messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }))
      ],
      generationConfig: {
        temperature: 1,
        topK: 64,
        topP: 0.95,
        maxOutputTokens: this.maxTokens,
        responseMimeType: 'text/plain'
      }
    };

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const fetched = await deps.fetch(url, {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!fetched.ok) {
        const errorResponse = await fetched.json();
        throw new GeminiError('Error from Google Gemini API', errorResponse);
      }

      const response = await fetched.json();
      const content = response.candidates[0].content.parts[0].text;
      
      return { 
        role: 'assistant', 
        content: [{ type: 'text', text: content }] 
      };
    } catch (error) {
      if (error instanceof GeminiError) {
        throw error;
      } else {
        throw new GeminiError('Error fetching from Google Gemini API', error);
      }
    }
  }
}

const gemini = (options) => new Gemini(options);

export default gemini;