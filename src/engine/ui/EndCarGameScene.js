import Phaser from "phaser";

export default class EndCarGameScene extends Phaser.Scene {
  constructor() {
    super("EndScene");
  }

  preload() {
    this.load.image("start-bg", "./assets/images/end-game.jpeg");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, "start-bg")
      .setDisplaySize(width, height);

    this.add
      .text(width / 2, height / 2 - 150, "VOCÊ COMETEU", {
        fontSize: "64px",
        color: "white",
        fontFamily: '"Silkscreen", "Courier New", monospace',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 90, "UMA INFRAÇÃO", {
        fontSize: "64px",
        color: "white",
        fontFamily: '"Silkscreen", "Courier New", monospace',
      })
      .setOrigin(0.5);

    this.startInstructions = this.add
      .text(width / 2, height / 2 + 20, "CLIQUE PARA TENTAR NOVAMENTE", {
        fontSize: "28px",
        color: "white",
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
