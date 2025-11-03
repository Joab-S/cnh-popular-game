import Phaser from "phaser";
import { resetPlayerState } from "../engine/player/playerState";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("CreditsScene");
  }

  create() {
    const { width, height } = this.scale;

    // Fundo preto
    this.add.rectangle(0, 0, width * 2, height * 2, 0x000000).setOrigin(0);

    // Introdução inicial
    const intro1 = this.add
      .text(width / 2, height / 2, "Há não muito tempo,", {
        fontSize: "22px",
        color: "#00bfff",
        fontFamily: '"Silkscreen", monospace',
      })
      .setOrigin(0.5);

    const intro2 = this.add
      .text(width / 2, height / 2 + 35, "Em um laboratório não muito distante", {
        fontSize: "22px",
        color: "#00bfff",
        fontFamily: '"Silkscreen", monospace',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [intro1, intro2],
      alpha: { from: 1, to: 0 },
      duration: 4000,
      delay: 2500,
      onComplete: () => {
        intro1.destroy();
        intro2.destroy();
        this.showMainCredits();
      },
    });
  }

  showMainCredits() {
    const { width, height } = this.scale;

    const lines = [
      "CNH POPULAR - O JOGO",
      "",
      "DESENVOLVIDO POR",
      "Laboratório Íris",
      "",
      "PROGRAMAÇÃO",
      "Vinicius Secundino",
      "Mariana Castro",
      "Joab Rocha",
      "",
      "ARTE E DESIGN",
      "Vinicius Secundino",
      "Mariana Castro",
      "Joab Rocha",
      "",
      "HISTÓRIA",
      "Vinicius Secundino",
      "Mariana Castro",
      "Joab Rocha",
      "",
      "MÚSICAS",
      "HeatleyBros",
    ];

    // Cria textos individuais
    const texts = [];
    const startY = height + 250;
    const baseLineSpacing = 50;

    
    lines.forEach((line, i) => {
      const size = line === "CNH POPULAR - O JOGO" ? 50 : 28;

      const indexProgramacao = lines.indexOf("PROGRAMAÇÃO");

      let color;

      if (i < indexProgramacao) {
        color = "#ffff00";
      } else {
        const isUpperCase = line === line.toUpperCase() && line.trim() !== "";
        color = isUpperCase ? "#00ffff" : "#ffff00";
      }
      const text = this.add.text(width / 2, startY + i * baseLineSpacing, line, {
        fontSize: `${size}px`,
        color: color,
        fontFamily: '"Silkscreen", monospace',
      });
      text.setOrigin(0.5);
      texts.push(text);
    });

    let elapsed = 0;
    const duration = 30000;
    const startOffset = height + 250;
    const endOffset = -height * 0.8;
    const fadeHeight = height * 0.25;

    this.time.addEvent({
      delay: 10,
      loop: true,
      callback: () => {
        elapsed += 16;
        const t = Phaser.Math.Easing.Quadratic.Out(elapsed / duration);
        const baseY = Phaser.Math.Interpolation.Linear([startOffset, endOffset], t);

        // Acúmulo de altura visual ajustado conforme escala
        let accumulatedY = baseY * 0.6;

        texts.forEach((text, i) => {
          const distance = height - accumulatedY;
          const depthFactor = Phaser.Math.Clamp(distance / height, 0, 1);

          // Escalas mais perceptíveis
          const scale = Phaser.Math.Interpolation.SmoothStep(depthFactor, 2.0, 0.25);
          const squash = Phaser.Math.Interpolation.SmoothStep(depthFactor, 1.2, 0.05);
          text.setScale(scale, squash);

          // Mantém espaçamento aparente constante
          const visualSpacing = baseLineSpacing * scale * 0.6;
          text.y = accumulatedY;
          accumulatedY += visualSpacing;

          // Fade in/out
          if (text.y < fadeHeight) {
            text.alpha = Phaser.Math.Clamp(text.y / fadeHeight, 0, 1);
          } else if (text.y > height - 120) {
            text.alpha = Phaser.Math.Clamp((height - text.y) / 120, 0, 1);
          } else {
            text.alpha = 1;
          }

          if (text.y < -80) text.destroy();
        });

        if (elapsed >= duration) {
          this.restartCnhGame();
        }
      },
    });

    // Botão Pular
    const skipText = this.add
      .text(width - 20, height - 20, "PULAR >>", {
        fontSize: "22px",
        color: "#00ffff",
        fontFamily: '"Silkscreen", monospace',
      })
      .setOrigin(1, 1)
      .setInteractive({ useHandCursor: true });

    skipText.on("pointerover", () => skipText.setColor("#ffff00"));
    skipText.on("pointerout", () => skipText.setColor("#00ffff"));
    skipText.on("pointerdown", () => this.restartCnhGame());
  }

  restartCnhGame() {
    resetPlayerState();
    this.scene.start("GameScene", { restart: true });
  }
}
