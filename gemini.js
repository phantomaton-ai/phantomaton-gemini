import path from 'path';

import processor from './processor.js';
import util from './util.js';

export class GeminiError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}

class Gemini {
  constructor({ apiKey, home, maxTokens, modalities, model, systemless }) {
    this.apiKey = apiKey;
    this.maxTokens = maxTokens || 65536;
    this.modalities = modalities || ['TEXT'];
    this.model = model || 'gemini-2.5-pro-exp-03-25';
    this.process = processor({ home: home || path.join('data', 'images') });
    this.systemless = systemless;
  }

  async converse(messages, system = '') {
    const payload = {
      contents: messages.map(({ role, content }) => ({
        role,
        parts: Array.isArray(content) ? content : [{ text: content }]
      })),
      generationConfig: {
        temperature: 1,
        topK: 64,
        topP: 0.95,
        maxOutputTokens: this.maxTokens,
        responseMimeType: 'text/plain',
        responseModalities: this.modalities
      }    };
    if (!this.systemless) {
      payload.systemInstruction = { parts: [{ text: system }] };
    } else {
      payload.contents = [
        {
          role: 'user',
          parts: [{ text: system }]
        },
        ...(payload.contents)
      ];
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const fetched = await util.fetch(url, {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!fetched.ok) {
        const errorResponse = await fetched.json();
        throw new GeminiError('Error from Google Gemini API', errorResponse);
      }

      const response = await fetched.json();
      const content = this.process(response.candidates[0].content.parts);
      
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