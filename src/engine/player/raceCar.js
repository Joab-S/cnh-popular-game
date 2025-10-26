const MAX_FORCE = 0.01;
const ROTATION_SPEED = 0.002;
const DRIFT_THRESHOLD = 0.005;
const DRIFT_COOLDOWN = 10;
const THROTTLE_RATE = 0.000008;

export default class Racecar extends Phaser.Physics.Matter.Image {
  throttle = 0;
  lastDriftTime = 0;

  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture);
    scene.add.existing(this);
    this.scene = scene;
    this.configure();
  }

  configure() {
    this.setScale(0.6);
    this.setOrigin(0.5);

    const w = this.width * this.scaleX;
    const h = this.height * this.scaleY;
    this.setBody({ type: "rectangle", width: w, height: h });

    this.setFrictionAir(0.06);
    this.body.angularDamping = 0.6;
    this.setFixedRotation(false);
    this.setAngle(-90);
  }

  update(delta, keys, time) {
    const { LEFT, RIGHT, UP, DOWN, W, A, S, D } = keys;
    const rotation = this.rotation;

    const buttonPressed = this.scene.buttonPressed;

    const leftPressed = LEFT.isDown || A.isDown || buttonPressed.left;
    const rightPressed = RIGHT.isDown || D.isDown || buttonPressed.right;
    const upPressed = UP.isDown || W.isDown || buttonPressed.up;
    const downPressed = DOWN.isDown || S.isDown || buttonPressed.down;

    // --- Aceleração / frenagem ---
    if (upPressed) {
      this.throttle = Phaser.Math.Clamp(
        this.throttle + THROTTLE_RATE * delta,
        -MAX_FORCE,
        MAX_FORCE
      );
    } else if (downPressed) {
      this.throttle = Phaser.Math.Clamp(
        this.throttle - THROTTLE_RATE * delta,
        -MAX_FORCE * 0.4,
        MAX_FORCE
      );
    } else {
      this.throttle *= 0.2;
    }

    const forceX = Math.cos(rotation) * this.throttle;
    const forceY = Math.sin(rotation) * this.throttle;
    this.applyForce({ x: forceX, y: forceY });

    const velocity = this.body.speed;
    const maxSpeed = 10;
    const speedFactor = Phaser.Math.Clamp(1 - velocity / maxSpeed, 0.2, 1);
    const dynamicRotationSpeed = ROTATION_SPEED * speedFactor;

    if (leftPressed && (upPressed || downPressed)) {
      this.setAngularVelocity(-dynamicRotationSpeed * delta);
    } else if (rightPressed && (upPressed || downPressed)) {
      this.setAngularVelocity(dynamicRotationSpeed * delta);
    }

    if (downPressed && Math.abs(this.throttle) > DRIFT_THRESHOLD) {
      if (time - this.lastDriftTime > DRIFT_COOLDOWN) {
        this.createDriftMarks();
        this.lastDriftTime = time;
      }
    }
  }

  createDriftMarks() {
    const offset = 30;
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
