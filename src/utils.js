// src/utils.js
export function uid() {
  // timestamp + random to reduce collisions
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
