import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import TrafficSignsGameScene from './TrafficSignsGameScene.js';

const config = { ...GAME_CONFIG, scene: [TrafficSignsGameScene] };
new Phaser.Game(config);
