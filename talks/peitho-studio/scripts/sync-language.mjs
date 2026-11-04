import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const script = readFileSync(new URL('../assets/deck-language.js', import.meta.url), 'utf8');
const directory = new URL('../layouts/', import.meta.url);
const navigation = `<nav class="language-switch" aria-label="Slide language">
    <button type="button" data-language="ja" aria-pressed="true" onclick="window.peithoDeckLanguage.set('ja')">日本語</button>
    <button type="button" data-language="en" aria-pressed="false" onclick="window.peithoDeckLanguage.set('en')">English</button>
  </nav>`;
for (const name of readdirSync(directory).filter(name => name.endsWith('.html'))) {
  const file = new URL(name, directory);
  let html = readFileSync(file, 'utf8').replace(/\n  <!-- language:start -->[\s\S]*?<!-- language:end -->/g, '');
  if (name === 'cover.html') {
    html = html.replace(/(<section[^>]*>)/, `$1\n  <!-- language:start -->${navigation}<!-- language:end -->`);
  }
  html = html.replace('</section>', `  <!-- language:start --><script>\n${script}</script><!-- language:end -->\n</section>`);
  writeFileSync(file, html);
}
