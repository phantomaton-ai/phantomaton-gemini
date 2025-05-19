import fs from 'fs';
import path from 'path';

import util from './util.js';

const inliner = ({ home }) => part => {
  if (!part.inlineData) return;
  if (part.inlineData.mimeType !== 'image/png') return;
  const buffer = Buffer.from(part.inlineData.data, 'base64');
  const filename = `${util.uuid()}.png`;
  const destination = path.join(home, filename);
  fs.writeFileSync(destination, buffer);
  return `![Generated image](${destination})`;
};

const processor = options => parts => {
  const inline = inliner(options);
  const process = part => part.text || inline(part);
  return parts.map(process).filter(p => p !== undefined).join('\n\n');
};

export default processor;