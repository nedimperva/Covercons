export type LocalIconPack = Record<string, string>;

// Minimal local SVG icons (24x24, viewBox 0 0 24 24)
// Note: paths use fill so our recoloring works; stylistically inspired by common icons
export const lucideIcons: LocalIconPack = {
  star:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 17.27L5.5 21l1.9-6.55L2 9.24l6.9-.6L12 2l3.1 6.64 6.9.6-5.4 5.21L18.5 21z"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.1 21.35l-1.1-1.02C5.14 15.36 2 12.5 2 8.99 2 6.24 4.24 4 6.99 4c1.66 0 3.22.81 4.11 2.09C12.79 4.81 14.35 4 16.01 4 18.76 4 21 6.24 21 8.99c0 3.51-3.14 6.37-8.9 11.35l-.0.01z"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5L20.49 19l-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  camera:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20 5h-3.2l-1.5-2H8.7L7.2 5H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2zm-8 13a5 5 0 110-10 5 5 0 010 10zm0-2.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>',
  code:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9.4 16.6L5.8 13l3.6-3.6L8 8l-5 5 5 5 1.4-1.4zm5.2 0L18.8 13l-4.2-4.2L13.2 9l3.6 3.6-3.6 3.6 1.4 1.4z"/></svg>',
  user:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg>',
  folder:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10 4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h6z"/></svg>',
  cloud:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19 18H7a4 4 0 010-8 5 5 0 019.9 1.2A3.5 3.5 0 1119 18z"/></svg>',
  bell:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z"/></svg>',
  book:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5 3h10a3 3 0 013 3v13H8a3 3 0 00-3 3V3zm3 4h8v2H8V7z"/></svg>',
  rocket:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2c3.5 0 6 3 6 6 0 4-3 8-6 12-3-4-6-8-6-12 0-3 2.5-6 6-6zm0 4a2 2 0 100 4 2 2 0 000-4zM6 14l-4 4 4-1 1-3-1-0zM18 14l-1 3 4 1-4-4z"/></svg>',
  bolt:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
};

export const lucideMetadata = Object.keys(lucideIcons).map((name) => ({ name, version: 1, tags: [name] }));

