import { expect, stub } from 'lovecraft';
import fs from 'fs';
import processor from './processor.js';
import util from './util.js';

describe('Response processor', () => {
  let process;

  beforeEach(() => {
    stub(fs, 'writeFileSync');
    stub(util, 'uuid');
    process = processor({ home: 'foo/bar' });
  });

  afterEach(() => {
    util.uuid.restore();
    fs.writeFileSync.restore();
  });

  it('passes text through', () => {
    expect(process([{ text: 'foo' }])).to.eq('foo');
  });

  it('concatenates text', () => {
    expect(process([{ text: 'foo' }, {text: 'bar'}])).to.eq('foo\n\nbar');
  });

  it('saves png images', () => {
    util.uuid.returns('test-uuid');
    expect(process([{ inlineData: {
      mimeType: 'image/png',
      data: 'Zm9vIGJhciBiYXo='
    } }])).to.eq('![Generated image](foo/bar/test-uuid.png)');
    expect(fs.writeFileSync.calledOnce).true;
  });

  it('skips unknown types', () => {
    expect(process([
      { inlineData: {
        mimeType: 'image/jpg',
        data: 'Zm9vIGJhciBiYXo='
      } },
      { fileData: {} },
      { text: 'foo' }
    ])).to.eq('foo');
  });
});