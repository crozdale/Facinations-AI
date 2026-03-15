export function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/^### (.+)$/gm, '<h3 style="font-family:\'Cinzel\',serif;font-size:0.78rem;color:#d4af37;letter-spacing:0.1em;margin:1rem 0 0.4rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-family:\'Cinzel\',serif;font-size:0.85rem;color:#d4af37;letter-spacing:0.1em;margin:1rem 0 0.4rem">$1</h2>')
    .replace(/^# (.+)$/gm, '<h2 style="font-family:\'Cinzel\',serif;font-size:0.9rem;color:#d4af37;letter-spacing:0.1em;margin:0.5rem 0 0.6rem">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e8d89a;font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#c8bfaf">$1</em>')
    .replace(/\n/g, '<br/>');
}