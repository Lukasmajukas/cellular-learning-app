// Our own icon set (redesign R02, DESIGN.md section 5). Drawn by Claude, no outside icon library.
// Every icon sits on a 24 x 24 grid and is made of lines (2 px wide, round ends) in one colour (currentColor).
// `lines` are SVG path outlines; `dots` are small filled circles [x, y, radius] (a tower's glowing head, the dot of an "i").
// Plain data (no React), so tools like the gallery can read it too. The <Icon> component in ../Icon.tsx draws it.

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const box = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

export type IconShape = { lines: string[]; dots?: [number, number, number][] };

export const ICONS = {
  // A flame: the streak.
  flame: { lines: ['M12 3c.6 3.2 5.5 5.6 5.5 10.6a5.5 5.5 0 0 1-11 0c0-2.4 1.1-4 2.6-5.2.2 1.8 1 2.9 2.3 3.4C10.8 9.4 10.9 6 12 3z'] },
  // A lightning bolt: XP.
  bolt: { lines: ['M13.5 2.5 5 13.5h6.2l-1.4 8 8.7-11.2h-6.3z'] },
  // A thin lattice tower with a glowing head and radio waves: a lesson that's ready to play.
  tower: {
    lines: ['M12 9 7.8 21', 'M12 9l4.2 12', 'M10.3 14h3.4', 'M9.1 17.5h5.8', 'M10.3 14l4.8 3.5', 'M8.6 3.6a4.6 4.6 0 0 0 0 5.8', 'M15.4 3.6a4.6 4.6 0 0 1 0 5.8'],
    dots: [[12, 6.5, 1.9]],
  },
  lock: { lines: [box(5, 10.5, 14, 10.5, 2.5), 'M8 10.5V8a4 4 0 0 1 8 0v2.5', 'M12 14.5v2.5'] },
  check: { lines: ['M5 12.5l4.5 4.5L19 7.5'] },
  cross: { lines: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'] },
  // Radio waves going out both ways from a dot: "on air", news, a broadcast.
  waves: {
    lines: ['M8.3 8.3a5.2 5.2 0 0 0 0 7.4', 'M15.7 8.3a5.2 5.2 0 0 1 0 7.4', 'M5.4 5.4a9.3 9.3 0 0 0 0 13.2', 'M18.6 5.4a9.3 9.3 0 0 1 0 13.2'],
    dots: [[12, 12, 1.9]],
  },
  mapPin: { lines: ['M12 21.5s-6.5-5.8-6.5-11.5a6.5 6.5 0 0 1 13 0c0 5.7-6.5 11.5-6.5 11.5z', circle(12, 10, 2.3)] },
  // Two arrows chasing each other round: the daily review (go round again).
  repeat: { lines: ['M4.5 11.5V9.5a3 3 0 0 1 3-3h12', 'M16.5 3.5l3 3-3 3', 'M19.5 12.5v2a3 3 0 0 1-3 3h-12', 'M7.5 20.5l-3-3 3-3'] },
  // Four tiles: the band memory heatmap.
  grid: { lines: [box(4, 4, 6.5, 6.5, 1.5), box(13.5, 4, 6.5, 6.5, 1.5), box(4, 13.5, 6.5, 6.5, 1.5), box(13.5, 13.5, 6.5, 6.5, 1.5)] },
  gear: {
    lines: ['M10.2 5.2 10.5 2.6h3l.3 2.6 1.7.7 2.1-1.6 2.1 2.1-1.6 2.1.7 1.7 2.6.3v3l-2.6.3-.7 1.7 1.6 2.1-2.1 2.1-2.1-1.6-1.7.7-.3 2.6h-3l-.3-2.6-1.7-.7-2.1 1.6-2.1-2.1 1.6-2.1-.7-1.7-2.6-.3v-3l2.6-.3.7-1.7-1.6-2.1 2.1-2.1 2.1 1.6z', circle(12, 12, 3)],
  },
  star: { lines: ['M12 3.6l2.4 5.8 6.2.4-4.8 4 1.5 6.1-5.3-3.3-5.3 3.3 1.5-6.1-4.8-4 6.2-.4z'] },
  // A snowflake: a streak freeze.
  freeze: { lines: ['M12 3v18', 'M4.2 7.5l15.6 9', 'M4.2 16.5l15.6-9', 'M9.6 4.6 12 7l2.4-2.4', 'M9.6 19.4 12 17l2.4 2.4'] },
  // A spanner: repair the streak.
  repair: { lines: ['M14 10 4.8 19.2a1.8 1.8 0 0 0 2.5 2.5l9.2-9.2', 'M14 10a4.6 4.6 0 0 1 5.4-6.6l-3 3 .3 2.4 2.4.3 3-3A4.6 4.6 0 0 1 16.5 12.5'] },
  back: { lines: ['M19.5 12h-15', 'M10.5 6l-6 6 6 6'] },
  close: { lines: ['M6 6l12 12', 'M18 6 6 18'] },
  soundOn: { lines: ['M3.5 9.5h3.5l5-4v13l-5-4H3.5z', 'M15.5 9.2a4 4 0 0 1 0 5.6', 'M18.3 6.4a8 8 0 0 1 0 11.2'] },
  soundOff: { lines: ['M3.5 9.5h3.5l5-4v13l-5-4H3.5z', 'M16 9.5l5 5', 'M21 9.5l-5 5'] },
  info: { lines: [circle(12, 12, 9), 'M12 11v5.5'], dots: [[12, 7.8, 1.3]] },
  chevron: { lines: ['M9.5 5.5 16 12l-6.5 6.5'] },
  // A magnifying glass: a clue to look at.
  search: { lines: [circle(10.5, 10.5, 6), 'M15 15l5.5 5.5'] },
  // A picture frame with a hill and a sun: a photo.
  image: { lines: [box(3, 5, 18, 14, 2.5), 'M3.5 17l5-5 4 4 2.5-2.5 5.5 5'], dots: [[15.5, 9.5, 1.6]] },
  // Settings rows (R15, idea I11): play a sample, reduce motion, frame rate, daily goal, the two looks, backup, the save file's folder.
  play: { lines: ['M8 5.5v13l10.5-6.5z'] },
  motion: { lines: [circle(15.5, 12, 5), 'M2.5 8.5h5', 'M2 12h5', 'M2.5 15.5h5'] },
  gauge: { lines: ['M5.6 18.4a9 9 0 1 1 12.8 0', 'M12 13.5l4-4.5'], dots: [[12, 13.5, 1.6]] },
  target: { lines: [circle(12, 12, 8.5), circle(12, 12, 4.5)], dots: [[12, 12, 1.5]] },
  moon: { lines: ['M19.5 14.5A8 8 0 1 1 9.5 4.5a6.2 6.2 0 0 0 10 10z'] },
  sun: { lines: [circle(12, 12, 4), 'M12 2.5v2', 'M12 19.5v2', 'M2.5 12h2', 'M19.5 12h2', 'M5.3 5.3l1.4 1.4', 'M17.3 17.3l1.4 1.4', 'M5.3 18.7l1.4-1.4', 'M17.3 6.7l1.4-1.4'] },
  backup: { lines: ['M12 3.5v10', 'M7.5 9.5 12 14l4.5-4.5', 'M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3'] },
  folder: { lines: ['M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z'] },
} satisfies Record<string, IconShape>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
