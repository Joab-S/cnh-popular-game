import Phaser from "phaser";
import Racecar from "../engine/player/raceCar";
import TrafficLight from "../engine/utils/trafficLight.js";

const WORLD_WIDTH = 3840;
const WORLD_HEIGHT = 2160;

export default class CarGameScene extends Phaser.Scene {
  constructor() {
    super("CarGameScene");
  }

  preload() {
    this.load.image("soil", "./assets/images/cidade.png");
    this.load.image("car", "./assets/images/car.png");
    this.load.image("barricade", "./assets/images/obstacle.png");
    this.load.image("tire-mark", "./assets/images/tire_mark.png");
  }

  create() {
    this.ground = this.add
      .tileSprite(
        WORLD_WIDTH / 2,
        WORLD_HEIGHT / 2,
        WORLD_WIDTH,
        WORLD_HEIGHT,
        "soil"
      )
      .setScrollFactor(0, 0)
      .setScale(1);

    this.driftLayer = this.add.layer();
    this.car = new Racecar(this, 100, 450, "car");
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.car, true, 0.7, 0.7);
    this.cameras.main.setZoom(1.2);
    this.matter.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 100, {
      isStatic: true,
    });
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // === Obstáculos ===
    this.hitboxes = [];
    const blockWidth = 1500;
    const blockHeight = 660;

    const boxes = [
      {
        x: blockWidth / 2 + 280,
        y: blockHeight / 2 + 280,
        width: blockWidth,
        height: blockHeight,
      },
      {
        x: blockWidth / 2 + 280,
        y: blockHeight / 2 + blockHeight + 560,
        width: blockWidth,
        height: blockHeight,
      },
      {
        x: blockWidth / 2 + blockWidth + 560,
        y: blockHeight / 2 + 280,
        width: blockWidth,
        height: blockHeight,
      },
      {
        x: blockWidth / 2 + blockWidth + 560,
        y: blockHeight / 2 + blockHeight + 560,
        width: blockWidth,
        height: blockHeight,
      },
    ];

    boxes.forEach((b) => {
      const body = this.matter.add.rectangle(b.x, b.y, b.width, b.height, {
        isStatic: true,
        label: "hitbox",
      });
      this.hitboxes.push(body);
    });

    this.trafficLight = new TrafficLight(this, 140, 330, 270, 100);

    this.matter.world.on("collisionstart", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === this.car.body || pair.bodyB === this.car.body) {
          const other = pair.bodyA === this.car.body ? pair.bodyB : pair.bodyA;

          if (other.label === "hitbox") {
            console.log("🚗💥 Colidiu com hitbox!");
            this.handleGameOver();
          }

          if (
            other.label === "trafficSensor" &&
            this.trafficLight.state === "red"
          ) {
            console.log("🚦 Parado no vermelho!");
            this.car.setVelocity(0, 0);
            this.car.throttle = 0;
          }
        }
      });
    });
  }

  update(time, delta) {
    const { scrollX, scrollY } = this.cameras.main;
    this.ground.setTilePosition(scrollX, scrollY);
    this.car.update(delta, this.cursorKeys, time);
  }

  handleGameOver() {
    console.log("Game Over! O carro colidiu com um obstáculo!");
  }
}
