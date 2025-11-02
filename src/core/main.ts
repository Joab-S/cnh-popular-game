import Phaser from "phaser";
import { GAME_CONFIG } from "./config.js";
import GameScene from "./GameScene.js";
import CarGameScene from "./CarGameScene.js";
import EndCarGameScene from "../engine/ui/EndCarGameScene.js";
import OrientationOverlay from "./OrientationOverlay.js";
import StartCarGameScene from "../engine/ui/StartCarGameScene.js";

const config = {
  ...GAME_CONFIG,
  scene: [
    StartCarGameScene,
    GameScene,
    CarGameScene,
    EndCarGameScene,
    OrientationOverlay,
  ],
};
new Phaser.Game(config);
