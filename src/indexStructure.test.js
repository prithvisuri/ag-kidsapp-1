import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('index.html structure', () => {
  it('keeps page sections as top-level siblings under main', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const main = doc.getElementById('main-content');
    const pages = ['landing-page', 'alphabet-page', 'math-page', 'rhymes-page'];

    pages.forEach((id) => {
      const el = doc.getElementById(id);
      expect(el).toBeTruthy();
      expect(el.parentElement).toBe(main);
    });
  });
});
