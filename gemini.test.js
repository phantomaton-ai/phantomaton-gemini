import { expect, stub } from 'lovecraft';
import gemini, { deps, GeminiError } from './gemini.js';

describe('Gemini', () => {
  let instance;

  beforeEach(() => {
    stub(deps, 'fetch');
    instance = gemini({ apiKey: 'test-api-key' });
  });

  afterEach(() => {
    deps.fetch.restore();
  });

  describe('options', () => {
    it('get passed down to the API', () => {
      const options = { apiKey: 'test-api-key', model: 'foo', maxTokens: 123 };
      gemini(options).converse([{ role: 'user', content: 'Hello' }]);
      expect(deps.fetch.calledOnce).to.equal(true);
      const body = JSON.parse(deps.fetch.lastCall.args[1].body);
      expect(body.generationConfig.maxOutputTokens).to.equal(options.maxTokens);
    });

    it('provide defaults', () => {
      const options = { apiKey: 'test-api-key'};
      gemini(options).converse([{ role: 'user', content: 'Hello' }]);
      expect(deps.fetch.calledOnce).to.equal(true);
      const body = JSON.parse(deps.fetch.lastCall.args[1].body);
      expect(body.generationConfig.maxOutputTokens).to.be.a('number').greaterThan(0);
    });
  });

  describe('converse', () => {
    it('should return a response from the Google Gemini API', async () => {
      const mockResponse = { 
        candidates: [{ 
          content: { 
            parts: [{ text: 'This is a test response.' }] 
          } 
        }] 
      };
      deps.fetch.resolves({ ok: true, json: async () => mockResponse });

      const response = await instance.converse([{ role: 'user', content: 'Hello' }]);
      expect(response.content[0].text).to.equal('This is a test response.');
    });

    it('should include system prompt', async () => {
      const mockResponse = { 
        candidates: [{ 
          content: { 
            parts: [{ text: 'This is a test response.' }] 
          } 
        }] 
      };
      deps.fetch.resolves({ ok: true, json: async () => mockResponse });

      await instance.converse([{ role: 'user', content: 'Hello' }], 'System prompt');
      const body = JSON.parse(deps.fetch.lastCall.args[1].body);
      expect(body.contents[0].parts[0].text).to.equal('System prompt');
    });

    it('should throw a GeminiError on error response', async () => {
      const mockResponse = { error: 'Something went wrong' };
      deps.fetch.resolves({ ok: false, json: async () => mockResponse });

      try {
        await instance.converse([{ role: 'user', content: 'Hello' }]);
        expect.fail();
      } catch (error) {
        expect(error).to.be.instanceOf(GeminiError);
        expect(error.message).to.equal('Error from Google Gemini API');
      }
    });

    it('should throw a GeminiError on fetch error', async () => {
      deps.fetch.rejects(new Error('Network error'));
      
      try {
        await instance.converse([{ role: 'user', content: 'Hello' }]);
        expect.fail();
      } catch (error) {
        expect(error).to.be.instanceOf(GeminiError);
        expect(error.message).to.equal('Error fetching from Google Gemini API');
      }
    });
  });
});