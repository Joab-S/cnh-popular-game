export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;
export const WORLD_SIZE_FACTOR = 2;

export const GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  worldSize: WORLD_SIZE_FACTOR,
  backgroundColor: '#0e0e0e',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
