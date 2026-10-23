import { describe, expect, it } from 'vitest';
import { normalizeFnuggPost } from './fnugg';

const post = (description: string) =>
  normalizeFnuggPost({ _id: '177_1', _source: { site_id: 177, title: 'Høst', description } } as never);

describe('fnugg post text', () => {
  it('rejoins a word split after its first letter', () => {
    expect(post('kommer. H\r\n\r\nøstfargene er fine')?.descriptionText).toBe('kommer. Høstfargene er fine');
  });
  it('keeps real paragraphs', () => {
    expect(post('<p>Første avsnitt.</p><p>Andre avsnitt.</p>')?.descriptionText).toBe('Første avsnitt.\nAndre avsnitt.');
  });
});
