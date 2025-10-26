import Phaser from "phaser";

export default class EndCarGameScene extends Phaser.Scene {
  constructor(x) {
    super("EndScene");
    console.log(x?.victory);
  }

  init(data) {
    this.victory = data.victory || false;
  }

  preload() {
    this.load.image("victory-bg", "./assets/images/car-victory.jpeg");
    this.load.image("fail-bg", "./assets/images/car-fail.jpeg");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.add
      .image(width / 2, height / 2, this.victory ? "victory-bg" : "fail-bg")
      .setDisplaySize(width, height);

    this.overlay = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
      .setScrollFactor(0)
      .setDepth(1000);

    if (this.victory) {
      this.add
        .text(width / 2, height / 2 - 150, "VOCÊ GANHOU", {
          fontSize: "64px",
          color: "white",
          fontFamily: '"Silkscreen", "Courier New", monospace',
        })
        .setOrigin(0.5)
        .setDepth(1001);
    } else {
      this.add
        .text(width / 2, height / 2 - 150, "VOCÊ COMETEU", {
          fontSize: "64px",
          color: "white",
          fontFamily: '"Silkscreen", "Courier New", monospace',
        })
        .setOrigin(0.5)
        .setDepth(1001);

      this.add
        .text(width / 2, height / 2 - 90, "UMA INFRAÇÃO", {
          fontSize: "64px",
          color: "white",
          fontFamily: '"Silkscreen", "Courier New", monospace',
        })
        .setOrigin(0.5)
        .setDepth(1001);
    }

    this.startInstructions = this.add
      .text(
        width / 2,
        height / 2 + 20,
        this.victory ? "CLIQUE PARA CONTINUAR" : "CLIQUE PARA TENTAR NOVAMENTE",
        {
          fontSize: "28px",
          color: "white",
          fontFamily: '"Silkscreen", "Courier New", monospace',
        }
      )
      .setOrigin(0.5)
      .setDepth(1001);

    this.tweens.add({
      targets: this.startInstructions,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    if (this.victory) {
      this.input.once("pointerdown", () => {
        this.game.events.emit("car:minigame:end", { victory: this.victory });
        this.scene.stop();
      });

      this.input.keyboard.once("keydown-SPACE", () => {
        this.game.events.emit("car:minigame:end", { victory: this.victory });
        this.scene.stop();
      });
    } else {
      this.input.once("pointerdown", () => {
        this.scene.start("CarGameScene");
      });

      this.input.keyboard.once("keydown-SPACE", () => {
        this.scene.start("CarGameScene");
      });
    }
  }
}
