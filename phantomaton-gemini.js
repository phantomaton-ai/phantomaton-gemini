import conversations from 'phantomaton-conversations';
import system from 'phantomaton-system';
import gemini from './gemini.js';

class Assistant {
  constructor(instance, system) {
    this.instance = instance;
    this.system = system;
  }

  async converse(turns, message) {
    const messages = [...turns.map(({ message, reply }) => [
      { role: 'user', content: message },
      { role: 'model', content: reply }
    ]).flat(), { role: 'user', content: message } ];
    const system = this.system();
    const { content } = await this.instance.converse(messages, system);
    return content.filter(
      ({ type }) => type === 'text'
    ).map(
      ({ text }) => text
    ).join('\n');
  }
}

const google = (options = {}) => {
  const instance = gemini(options);
  instance.include = ['phantomaton-conversations', 'phantomaton-system'];
  instance.install = [
    conversations.assistant.provider(
      [system.system.resolve],
      ([system]) => new Assistant(instance, system)
    )
  ];
  return instance;
};

export default google;