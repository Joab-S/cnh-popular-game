import Phaser from "phaser";

export default class StartCarGameScene extends Phaser.Scene {
  constructor() {
    super("StartCarGameScene");
  }

  preload() {
    this.load.image("start-bg", "./assets/images/start_bg.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, "start-bg")
      .setDisplaySize(width, height);

    this.add
      .text(width / 2, height / 2 - 150, "Prova Prática", {
        fontSize: "64px",
        color: "black",
        fontFamily: '"Silkscreen", "Courier New", monospace',
      })
      .setOrigin(0.5);

    this.startInstructions = this.add
      .text(width / 2, height / 2 + 20, "Clique em qualquer lugar para começar", {
        fontSize: "28px",
        color: "black",
        fontFamily: '"Silkscreen", "Courier New", monospace',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.startInstructions,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.input.once("pointerdown", () => {
      this.scene.start("CarGameScene");
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("CarGameScene");
    });
  }
}
