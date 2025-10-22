import Phaser from "phaser";

const MAX_FORCE = 0.02; 
const ROTATION_SPEED = 0.002; 
const DRIFT_THRESHOLD = 0.005; 
const DRIFT_COOLDOWN = 50; 

class Racecar extends Phaser.Physics.Matter.Image {
  throttle = 0;
  lastDriftTime = 0;

  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture);
    scene.add.existing(this);
    this.scene = scene;
    this.configure();
  }

  configure() {
    this.setScale(0.2);
    this.setOrigin(0.5);

    const w = this.width * this.scaleX;
    const h = this.height * this.scaleY;
    this.setBody({ type: "rectangle", width: w, height: h });

    this.setFrictionAir(0.06);
    this.body.angularDamping = 0.6;
    this.setFixedRotation(false);
    this.setAngle(-90);
  }

  update(delta, cursorKeys, time) {
    const { left, right, up, down } = cursorKeys;
    const rotation = this.rotation;

    if (up.isDown) {
      this.throttle = Phaser.Math.Clamp(
        this.throttle + 0.1 * delta,
        -MAX_FORCE,
        MAX_FORCE
      );
    } else if (down.isDown) {
      this.throttle = Phaser.Math.Clamp(
        this.throttle - 0.1 * delta,
        -MAX_FORCE * 0.1,
        MAX_FORCE
      );
    } else {
      this.throttle *= 0.1;
    }

    const forceX = Math.cos(rotation) * this.throttle;
    const forceY = Math.sin(rotation) * this.throttle;
    this.applyForce({ x: forceX, y: forceY });

    if (left.isDown) {
      this.setAngularVelocity(-ROTATION_SPEED * delta);
    } else if (right.isDown) {
      this.setAngularVelocity(ROTATION_SPEED * delta);
    }

    if (down.isDown && Math.abs(this.throttle) > DRIFT_THRESHOLD) {
      if (time - this.lastDriftTime > DRIFT_COOLDOWN) {
        this.createDriftMarks();
        this.lastDriftTime = time;
      }
    }
  }

  createDriftMarks() {
    const offset = 35;
    const angle = this.rotation + Math.PI / 2;

    const rearLeftX = this.x + Math.cos(angle) * -offset;
    const rearLeftY = this.y + Math.sin(angle) * -offset;
    const rearRightX = this.x + Math.cos(angle) * offset;
    const rearRightY = this.y + Math.sin(angle) * offset;

    const markLeft = this.scene.add.image(rearLeftX, rearLeftY, "tire-mark");
    const markRight = this.scene.add.image(rearRightX, rearRightY, "tire-mark");

    markLeft.setRotation(this.rotation);
    markRight.setRotation(this.rotation);

    markLeft.setAlpha(0.6);
    markRight.setAlpha(0.6);

    markLeft.setScale(1.2);
    markRight.setScale(1.2);

    this.scene.driftLayer.add([markLeft, markRight]);

    this.scene.tweens.add({
      targets: [markLeft, markRight],
      alpha: 0,
      duration: 2000,
      onComplete: () => {
        markLeft.destroy();
        markRight.destroy();
      },
    });
  }
}

export default class CarGameScene extends Phaser.Scene {
  preload() {
    this.load.image("soil", "./assets/images/solo.png");
    this.load.image("car", "./assets/images/carro.png");

    this.load.image("tire-mark", "./assets/images/tire_mark.png");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.ground = this.add
      .tileSprite(width / 2, height / 2, 1600, 450, "soil")
      .setScrollFactor(0, 0);

    this.driftLayer = this.add.layer();

    this.car = new Racecar(this, width / 2, height / 2, "car");
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.car, true, 0.9, 0.9);

    this.matter.world.setBounds(0, 0, 1600, 900, 100, { isStatic: true });
    this.cameras.main.setBounds(0, 0, 1600, 900);
  }

  update(time, delta) {
    const { scrollX, scrollY } = this.cameras.main;
    this.ground.setTilePosition(scrollX, scrollY);

    this.car.update(delta, this.cursorKeys, time);
  }
}
