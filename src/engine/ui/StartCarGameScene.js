import Phaser from "phaser";

export default class StartCarGameScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
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
      .text(width / 2, height / 2 - 100, "Corrida Urbana", {
        fontSize: "64px",
        color: "#ffffff",
        fontFamily: '"Silkscreen", "Courier New", monospace',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 20, "Pressione ESPAÇO para começar", {
        fontSize: "28px",
        color: "#dddddd",
        fontFamily: '"Silkscreen", "Courier New", monospace',
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("CarGameScene");
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("CarGameScene");
    });
  }
}
