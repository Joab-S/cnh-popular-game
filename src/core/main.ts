import Phaser from "phaser";
import { GAME_CONFIG } from "./config.js";
import GameScene from "./GameScene.js";
import CarGameScene from "./CarGameScene.js";
import EndCarGameScene from "../engine/ui/EndCarGameScene.js";
import OrientationOverlay from "./OrientationOverlay.js";
import CreditsScene from "./CreditsScene.js";

const config = {
  ...GAME_CONFIG,
  scene: [
    CarGameScene,
    GameScene,
    EndCarGameScene,
    CreditsScene,
    OrientationOverlay,
  ],
};
new Phaser.Game(config);
