import Phaser from "phaser";
import { GAME_CONFIG } from "./config.js";
import GameScene from "./GameScene.js";
import CarGameScene from "./CarGameScene.js";
import EndCarGameScene from "../engine/ui/EndCarGameScene.js";
import StartCarGameScene from "../engine/ui/StartCarGameScene.js";
// import MemoryGameScene from "./MemoryGameScene.js";

const config = {
  ...GAME_CONFIG,
  scene: [GameScene, StartCarGameScene, CarGameScene, EndCarGameScene],
};
new Phaser.Game(config);
