/**
 * The route: five sectors of waves, then the Warden. Each wave sends `count`
 * enemies of one kind in a formation, starting `at` ticks into its sector.
 * Adding a sector means adding one entry to SECTORS.
 */

export type EnemyKind = "drone" | "dart" | "turret" | "lancer";
export type Formation = "line" | "vee" | "column" | "pincer";

export interface Wave {
  at: number;
  kind: EnemyKind;
  count: number;
  formation: Formation;
  /** Centre of a line or vee, or the x of a column. Pincers use both edges. */
  x?: number;
}

export interface Sector {
  name: string;
  subtitle: string;
  /** Ticks until the next sector, once the screen is clear. */
  length: number;
  waves: Wave[];
}

/** How long past its length a sector waits for stragglers before moving on. */
export const OVERTIME = 240;

export const BOSS_NAME = "The Warden";

export const SECTORS: Sector[] = [
  {
    name: "Outer Drift",
    subtitle: "Scouts ahead",
    length: 1560,
    waves: [
      { at: 60, kind: "drone", count: 4, formation: "line" },
      { at: 360, kind: "drone", count: 5, formation: "vee", x: 168 },
      { at: 660, kind: "drone", count: 5, formation: "vee", x: 312 },
      { at: 960, kind: "drone", count: 6, formation: "line" },
      { at: 1200, kind: "drone", count: 4, formation: "column", x: 120 },
      { at: 1260, kind: "drone", count: 4, formation: "column", x: 360 },
    ],
  },
  {
    name: "Shatter Belt",
    subtitle: "Divers incoming",
    length: 1800,
    waves: [
      { at: 60, kind: "drone", count: 6, formation: "vee" },
      { at: 300, kind: "dart", count: 4, formation: "line" },
      { at: 600, kind: "dart", count: 5, formation: "column", x: 144 },
      { at: 720, kind: "dart", count: 5, formation: "column", x: 336 },
      { at: 1020, kind: "drone", count: 7, formation: "line" },
      { at: 1140, kind: "dart", count: 5, formation: "vee" },
      { at: 1440, kind: "dart", count: 6, formation: "line" },
    ],
  },
  {
    name: "Gun Lanes",
    subtitle: "Turrets online",
    length: 1920,
    waves: [
      { at: 60, kind: "turret", count: 1, formation: "line" },
      { at: 240, kind: "drone", count: 6, formation: "vee" },
      { at: 540, kind: "turret", count: 2, formation: "line" },
      { at: 840, kind: "dart", count: 6, formation: "column", x: 240 },
      { at: 1080, kind: "turret", count: 2, formation: "line" },
      { at: 1140, kind: "drone", count: 6, formation: "line" },
      { at: 1500, kind: "turret", count: 3, formation: "line" },
    ],
  },
  {
    name: "Lancer Gate",
    subtitle: "Crossfire",
    length: 1920,
    waves: [
      { at: 60, kind: "lancer", count: 4, formation: "pincer" },
      { at: 360, kind: "dart", count: 6, formation: "vee" },
      { at: 600, kind: "lancer", count: 6, formation: "pincer" },
      { at: 780, kind: "turret", count: 2, formation: "line" },
      { at: 1140, kind: "lancer", count: 6, formation: "pincer" },
      { at: 1260, kind: "drone", count: 8, formation: "vee" },
      { at: 1560, kind: "dart", count: 8, formation: "line" },
    ],
  },
  {
    name: "Last Approach",
    subtitle: "Everything they have",
    length: 2040,
    waves: [
      { at: 60, kind: "turret", count: 3, formation: "line" },
      { at: 180, kind: "lancer", count: 6, formation: "pincer" },
      { at: 540, kind: "dart", count: 6, formation: "column", x: 120 },
      { at: 540, kind: "dart", count: 6, formation: "column", x: 360 },
      { at: 900, kind: "drone", count: 9, formation: "vee" },
      { at: 1020, kind: "turret", count: 2, formation: "line" },
      { at: 1320, kind: "lancer", count: 8, formation: "pincer" },
      { at: 1560, kind: "dart", count: 8, formation: "vee" },
    ],
  },
];

/** The names shown in the HUD's route list, ending with the boss. */
export const ROUTE_NAMES = [...SECTORS.map((sector) => sector.name), BOSS_NAME];

/** When (ticks into the sector) and where the i-th enemy of a wave appears. */
export function placeInWave(
  wave: Wave,
  i: number,
): { t: number; x: number; y: number } {
  const centre = wave.x ?? 240;
  const offset = i - (wave.count - 1) / 2;
  switch (wave.formation) {
    case "line": // side by side, all at once
      return { t: wave.at, x: centre + offset * 64, y: -30 };
    case "vee": // tighter spacing, the middle arrives first
      return { t: wave.at + Math.abs(offset) * 10, x: centre + offset * 44, y: -30 };
    case "column": // one behind another
      return { t: wave.at + i * 24, x: centre, y: -30 };
    case "pincer": { // pairs from the left and right edges, each pair lower
      const row = Math.floor(i / 2);
      return { t: wave.at + row * 30, x: i % 2 === 0 ? -30 : 510, y: 70 + row * 50 };
    }
  }
}
