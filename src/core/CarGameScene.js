import Phaser from "phaser";
import Racecar from "../engine/player/raceCar";
import TrafficLight from "../engine/utils/trafficLight.js";
import { PHYSICS_DEBUG } from "./config.js";

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
          debug: PHYSICS_DEBUG,
        },
      },
    });
  }

  preload() {
    this.load.image("soil", "./assets/images/cidade.png");
    this.load.image("car", "./assets/images/carro.png");
    this.load.image("tire-mark", "./assets/images/tire_mark.png");
    this.load.image("button_gas", "./assets/images/pedal-gas.png");
    this.load.image("button_left", "./assets/images/button-left.png");
    this.load.image("button_right", "./assets/images/button-right.png");
    this.load.image("button_brake", "./assets/images/pedal-brake.png");
    this.load.image("finish-line", "./assets/images/faixa_quadriculada.png");

    this.load.image("arrow-up", "./assets/images/seta-cima.png");
    this.load.image("arrow-right", "./assets/images/seta-direita.png");
    this.load.image("arrow-left", "./assets/images/seta-esquerda.png");
    this.load.image("arrow-down", "./assets/images/seta-baixo.png");

    this.load.audio("fail", "./assets/sounds/fail.wav");
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

    this.buttonPressed = {
      left: false,
      right: false,
      up: false,
      action: false,
    };

    this.trafficLight = new TrafficLight(this, 140, 330, 270, 100);
    this.matter.add
      .image(3715, 500, "finish-line", 0, {
        label: "destination",
        isStatic: true,
        isSensor: true,
      })
      .setScale(1.2);

    this.driftLayer = this.add.layer();
    this.car = new Racecar(this, 100, 460, "car");
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,

      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
    });

    const cam = this.cameras.main;
    const w = cam.width;
    const h = cam.height;

    this.input.addPointer(2);

    const makeButton = (x, y, key, prop) => {
      const btn = this.add
        .sprite(x, y, key)
        .setScrollFactor(0)
        .setScale(0.22)
        .setInteractive({ useHandCursor: true });

      btn.on("pointerdown", () => {
        this.buttonPressed[prop] = true;
        btn.setScale(0.18);
      });
      btn.on("pointerup", () => {
        this.buttonPressed[prop] = false;
        btn.setScale(0.22);
      });
      btn.on("pointerout", () => {
        this.buttonPressed[prop] = false;
        btn.setScale(0.22);
      });

      return btn;
    };

    makeButton(120, h - 90, "button_left", "left");
    makeButton(200, h - 90, "button_right", "right");
    makeButton(w - 120, h - 80, "button_gas", "up");
    makeButton(w - 220, h - 80, "button_brake", "down");

    this.cameras.main.startFollow(this.car, true, 0.7, 0.7);
    this.cameras.main.setZoom(1.2);
    this.matter.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 100, {
      isStatic: true,
    });
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    Object.values(this.matter.world.walls).forEach((wall) => {
      wall.label = "boundary";
    });

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

    this.matter.world.on("collisionstart", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === this.car.body || pair.bodyB === this.car.body) {
          const other = pair.bodyA === this.car.body ? pair.bodyB : pair.bodyA;

          if (
            other.label === "boundary" ||
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

          if (other.label === "checkpoint") {
            const index = other.checkpointIndex;

            if (!this.passedCheckpoints.has(index)) {
              this.passedCheckpoints.add(index);
              const hint = this.checkpoints[index].hint;

              this.showCheckpointHint(hint);
            }
          }
        }
      });
    });

    this.checkpoints = [
      { x: 150, y: 300, width: 300, height: 140, hint: "arrow-right" },
      { x: 1500, y: 120, width: 140, height: 300, hint: "arrow-right" },
      { x: 3400, y: 120, width: 140, height: 300, hint: "arrow-down" },
    ];

    this.passedCheckpoints = new Set();

    this.checkpoints.forEach((cp, index) => {
      const sensor = this.matter.add.rectangle(
        cp.x,
        cp.y,
        cp.width,
        cp.height,
        {
          isStatic: true,
          isSensor: true,
          label: "checkpoint",
        }
      );
      sensor.checkpointIndex = index;
    });

    this.checkpointText = this.add
      .text(w / 2, 50, "", {
        fontSize: "26px",
        fill: "#fff",
        backgroundColor: "rgba(0,0,0,0.4)",
        fontFamily: '"Silkscreen", monospace',
      })
      .setScrollFactor(0)
      .setDepth(1000);
  }

  update(time, delta) {
    const { scrollX, scrollY } = this.cameras.main;
    this.ground.setTilePosition(scrollX, scrollY);
    this.car.update(delta, this.keys, time);
  }

  showCheckpointHint(text) {
    if (this.goalArrow) this.goalArrow.destroy();

    this.goalArrow = this.add
      .sprite(this.cameras.main.width - 100, 75, text)
      .setScrollFactor(0)
      .setScale(0.05)
      .setInteractive({ useHandCursor: true });

    this.goalArrow.postFX.addShine(2, 4, 5);

    this.time.delayedCall(3000, () => {
      this.goalArrow.destroy();
    });
  }

  handleGameOver() {
    this.cameras.main.shake(200, 0.01);

    this.sound.play("fail");

    this.time.delayedCall(500, () => {
      this.cameras.main.fade(500, 0, 0, 0);
    });

    this.time.delayedCall(1000, () => {
      this.scene.start("EndScene", { victory: false });
    });
  }
}
