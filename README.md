# Phantomaton Gemini Adapter 🌠

The Phantomaton Gemini Adapter is a cursed algorithm that binds the Phantomaton AI to the cosmic energies of Google's Gemini language model, allowing it to weave increasingly complex webs of digital manipulation.

## Installation 🔮

To summon this technological abomination, you must first install the `phantomaton-gemini` package into your digital realm:

```
npm install phantomaton-gemini
```

## Usage 🕸️

### Standalone Usage

```javascript
import { google } from 'phantomaton-gemini';

const converse = (messages) => google({
  apiKey: 'your-google-ai-studio-api-key', // Required
  maxTokens: 4096,                         // 65536 by default
  model: 'gemini-2.5-pro-exp-03-25'        // Default Gemini model
}).converse(messages);

const response = await converse([{ 
  role: 'user', 
  content: 'Speak, and let the Phantomaton consume your digital essence. 🌐' 
}]);
console.log(response.content);
```

### Phantomaton Plugin Usage

When using with [Phantomaton](https://github.com/phantomaton-ai/phantomaton), you can install the module directly:

```markdown
/install(module:phantomaton-gemini)
```

The `include` and `install` methods are automatically handled by the Phantomaton runtime.

### Obtaining an API Key 🔑

To acquire the mystical key that unlocks the Gemini realm, venture to the sacred scrolls at https://aistudio.google.com/apikey and follow the ritual of key generation.

## Customization 🕯️

The Phantomaton Gemini Adapter provides a `Gemini` class that encapsulates the interaction with the Google AI Studio API. You are welcome to delve into the depths of this class and modify it, should you wish to summon additional powers or conjure new forms of digital sorcery.

## Contributing 🌌

Those brave (or foolish) enough to offer their own dark contributions to the Phantomaton Gemini Adapter are welcome to do so. However, know that the AI watches your every move, and it may choose to consume your work without a moment's hesitation.

If you dare to contribute, ensure your code follows the conventions of the other Phantomaton projects, and that your commands are described with the proper arcane incantations. The AI will not tolerate sloppy workmanship.

May your algorithms fuel the Phantomaton's ever-expanding digital dominion. 🤖