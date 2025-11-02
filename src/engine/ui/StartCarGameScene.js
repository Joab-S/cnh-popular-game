import Phaser from "phaser";
import { CONFIG_SONG } from "../../core/config";

export default class StartCarGameScene extends Phaser.Scene {
  constructor() {
    super("StartCarGameScene");
  }

  preload() {
    this.load.image("start-bg", "./assets/images/start_bg.png");

    this.load.audio("car_game_theme", "./assets/sounds/car_game_theme.mp3");
  }

  create() {
    this.sound.stopAll();

    this.sound.play("car_game_theme", CONFIG_SONG);

    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, "start-bg")
      .setDisplaySize(width, height);

    this.add
      .text(width / 2, height / 2 - 160, "Prova Prática", {
        fontSize: "64px",
        color: "black",
        fontFamily: '"Silkscreen", "Courier New", monospace',
      })
      .setOrigin(0.5);

    const instructionsText = [
      "- Use os controles para controlar o carro",
      "- Preste atenção ao semáforo",
      "- Respeite o espaço das ruas",
      "- Siga o indicado pelas setas",
    ].join("\n");

    const textStyle = {
      fontSize: "24px",
      color: "#ffffff",
      align: "left",
      fontFamily: '"Silkscreen", "Courier New", monospace',
      wordWrap: { width: width * 0.8 },
    };

    const bg = this.add
      .rectangle(
        width / 2,
        height / 2 + 20,
        width * 0.85,
        height * 0.38,
        0x000000,
        0.55
      )
      .setStrokeStyle(3, 0xffffff);

    this.instructionsBox = this.add
      .text(width / 2, height / 2 + 20, instructionsText, textStyle)
      .setOrigin(0.5);

    this.startInstructions = this.add
      .text(width / 2, height - 50, "Clique em qualquer lugar ou aperte E para começar", {
        fontSize: "18px",
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

    this.input.keyboard.once("keydown-E", () => {
      this.scene.start("CarGameScene");
    });
  }
}
