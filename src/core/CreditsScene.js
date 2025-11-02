import Phaser from "phaser";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("StarWarsCreditsScene");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width * 2, height * 2, 0x000000).setOrigin(0);
    const introText = this.add
      .text(width / 2, height / 2, "Há não muito tempo,", {
        fontSize: "20px",
        color: "#00bfff",
        fontFamily: '"Silkscreen", monospace',
      })
      .setOrigin(0.5);

    const introText2 = this.add
      .text(
        width / 2,
        height / 2 + 30,
        "Em um laboratório não muito distante",
        {
          fontSize: "20px",
          color: "#00bfff",
          fontFamily: '"Silkscreen", monospace',
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: [introText, introText2],
      alpha: { from: 1, to: 0 },
      duration: 4000,
      delay: 3000,
      onComplete: () => {
        introText.destroy();
        this.showMainCredits();
      },
    });
  }

  showMainCredits() {
    const { width, height } = this.scale;

    const title = this.add
      .text(width / 2, height, "CNH POPULAR - O JOGO", {
        fontSize: "40px",
        color: "#ffff00",
        fontFamily: '"Silkscreen", monospace',
        align: "center",
        wordWrap: { width: width - 100 },
      })
      .setOrigin(0.5);

    const creditsText = `
DESENVOLVIDO POR
Laboratório Íris

PROGRAMAÇÃO
Vinicius Secundino
Mariana Castro
Joab Rocha

ARTE E DESIGN
Vinicius Secundino
Mariana Castro
Joab Rocha

HISTÓRIA
Vinicius Secundino
Mariana Castro
Joab Rocha

MÚSICAS
HeatleyBros
`;

    const credits = this.add
      .text(width / 2, height + 600, creditsText, {
        fontSize: "26px",
        color: "#ffff00",
        fontFamily: '"Silkscreen", monospace',
        align: "center",
        lineSpacing: 12,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [title, credits],
      y: "-=1800",
      duration: 30000,
      ease: "Linear",
      onComplete: () => {
        this.scene.start("GameScene");
      },
    });

    const skipText = this.add
      .text(width - 20, height - 20, "Pular >>", {
        fontSize: "22px",
        color: "#00ffff",
        fontFamily: '"Silkscreen", monospace',
      })
      .setOrigin(1, 1)
      .setInteractive({ useHandCursor: true });

    skipText.on("pointerover", () => skipText.setColor("#ffff00"));
    skipText.on("pointerout", () => skipText.setColor("#00ffff"));
    skipText.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
