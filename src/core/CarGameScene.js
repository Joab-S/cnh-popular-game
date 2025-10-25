import Phaser from "phaser";
import Racecar from "../engine/player/raceCar";
import TrafficLight from "../engine/utils/trafficLight.js";

const WORLD_WIDTH = 3840;
const WORLD_HEIGHT = 2160;

export default class CarGameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "CarGameScene",
      physics: {
        default: "matter",
        matter: {
          gravity: { x: 0, y: 0 },
          debug: true,
        },
      },
    });
  }

  preload() {
    this.load.image("soil", "./assets/images/cidade.png");
    this.load.image("car", "./assets/images/carro.png");
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
    this.car = new Racecar(this, 100, 460, "car");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.cursorKeys.wKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.cursorKeys.aKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.cursorKeys.sKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.cursorKeys.dKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    this.cameras.main.startFollow(this.car, true, 0.7, 0.7);
    this.cameras.main.setZoom(1.2);
    this.matter.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 100, {
      isStatic: true,
    });
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

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

    const destination = {
      x: 800,
      y: 150,
      radius: 50,
    };

    this.matter.add.circle(destination.x, destination.y, destination.radius, {
      isStatic: true,
      isSensor: true,
      label: "destination",
    });

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

          if (
            other.label === "hitbox" ||
            (other.label === "trafficSensor" &&
              this.trafficLight.state === "red")
          ) {
            this.handleGameOver();
          }

          if (other.label === "destination") {
            console.log("Parabéns! Você chegou ao destino!");
            this.scene.start("EndScene", { victory: true });
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
    this.cameras.main.shake(200, 0.01);

    this.time.delayedCall(500, () => {
      this.cameras.main.fade(500, 0, 0, 0);
    });

    this.time.delayedCall(1000, () => {
      this.scene.start("EndScene", { victory: false });
    });
  }
}
