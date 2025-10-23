export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;
export const WORLD_SIZE = GAME_WIDTH * 1.5;
export const AREAS = {
  home: "home",
  city: "city",
  drivingSchool: "driving-school",
  clinic: "clinic",
};

export const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
    default: "matter",
    matter: {
      gravity: { x: 0, y: 0 },
      debug: true, // ative para visualizar hitboxes
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
