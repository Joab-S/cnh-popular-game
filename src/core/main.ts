import Phaser from "phaser";
import { GAME_CONFIG } from "./config.js";
import GameScene from "./GameScene.js";
// import TrafficSignsGameScene from "./TrafficSignsGameScene.js";
import CarGameScene from "./CarGameScene.js";
import EndCarGameScene from "../engine/ui/EndCarGameScene.js";
// import StartCarGameScene from "../engine/ui/StartCarGameScene.js";

const config = { ...GAME_CONFIG, scene: [CarGameScene, EndCarGameScene] };
// const config = { ...GAME_CONFIG, scene: [TrafficSignsGameScene] };
// const config = { ...GAME_CONFIG, scene: [GameScene] };
new Phaser.Game(config);
