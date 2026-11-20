import type Phaser from "phaser";

const FADE_MS = 450;
const FADE_RGB = [4, 2, 12] as const;
const leaving = new WeakSet<Phaser.Scene>();

export function fadeIn(scene: Phaser.Scene, ms: number): void {
  scene.cameras.main.fadeIn(ms, ...FADE_RGB);
}

/**
 * Fades out, then starts another scene with data. A second request while
 * the scene is already fading out is ignored.
 */
export function fadeTo(
  scene: Phaser.Scene,
  key: string,
  data?: object,
): void {
  if (leaving.has(scene)) return;
  leaving.add(scene);
  const camera = scene.cameras.main;
  camera.fadeOut(FADE_MS, ...FADE_RGB);
  camera.once("camerafadeoutcomplete", () => {
    leaving.delete(scene);
    scene.scene.start(key, data);
  });
}

export function isLeaving(scene: Phaser.Scene): boolean {
  return leaving.has(scene);
}
