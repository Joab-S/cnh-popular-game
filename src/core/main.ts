import Phaser from "phaser";
import { GAME_CONFIG } from "./config.js";
import GameScene from "./GameScene.js";
// import TrafficSignsGameScene from "./TrafficSignsGameScene.js";

// const config = { ...GAME_CONFIG, scene: [TrafficSignsGameScene] };
const config = { ...GAME_CONFIG, scene: [GameScene] };
new Phaser.Game(config);
