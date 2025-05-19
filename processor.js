import * as uuid from 'uuid';
import fs from 'fs';
import path from 'path';

const inliner = options => part => {
  if (!part.inlineData) return;
  if (part.inlineData.mimeType !== 'image/png') return;
  const buffer = Buffer.from(part.inlineData.data, 'base64');
  const home = options.home || path.resolve('data', 'images');
  const filename = `${uuid.v4()}.png`;
  const destination = path.resolve(home, filename);
  fs.writeFileSync(destination, buffer);
  return `![Generated image](${destination})`;
};

const processor = options => parts => {
  const inline = inliner(options);
  return parts.map(part => part.text || inline(part) || '').join('\n\n');
};

export default processor;