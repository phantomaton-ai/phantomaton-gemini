import { expect, stub } from 'lovecraft';
import hierophant from 'hierophant';
import priestess from 'priestess';
import system from 'phantomaton-system';
import conversations from 'phantomaton-conversations';
import google from './phantomaton-gemini.js';

describe('Phantomaton Gemini', () => {
  let container;
  let instance;

  beforeEach(() => {
    container = hierophant();
    instance = google();
    system().install.forEach(c => container.install(c));
    conversations().install.forEach(c => container.install(c));
    instance.install.forEach(c => container.install(c));
    stub(instance, 'converse');
  });

  it('provides an assistant that uses the system prompt', async () => {
    const systemPrompt = 'This is the system prompt.';
    const userMessage = 'Hello, how are you?';
    const assistantReply = 'I am doing well, thank you for asking.';

    container.install(priestess.input.resolver());
    container.install(priestess.input.provider([], () => () => systemPrompt));

    const [assistant] = container.resolve(conversations.assistant.resolve);

    instance.converse.callsFake((messages, system) => Promise.resolve({
      role: 'assistant',
      content: [
        { type: 'text', text: system },
        { type: 'text', text: messages[messages.length - 1].content },
        { type: 'text', text: assistantReply }
      ]
    }));

    const result = await assistant.converse([
      { message: 'hello!', reply: 'hi...' }
    ], userMessage);

    expect(result).to.equal(`${systemPrompt}\n${userMessage}\n${assistantReply}`);
  });

  it('includes dependencies on conversations and system prompt', () => {
    expect(instance.include).deep.eq(
      ['phantomaton-conversations', 'phantomaton-system']
    );
  });
});