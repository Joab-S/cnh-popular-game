import Phaser from "phaser";
import { resetPlayerState } from "../engine/player/playerState";
import { CONFIG_SONG } from "./config";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("CreditsScene");
  }

  preload() {
    this.load.audio("credits-song", "./assets/sounds/credits-song.mp3");

    this.load.image("logo", "./assets/images/iris-logo-marca.png");

    this.load.image("logo-detran", "./assets/images/logo-detran.png");
  }

  create() {
    this.sound.stopAll();

    this.sound.play("credits-song", CONFIG_SONG);

    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width * 2, height * 2, 0x000000).setOrigin(0);

    const detranButton = this.add
      .text(150, height - 50, "SAIBA MAIS", {
        fontSize: "18px",
        color: "#00ffff",
        fontFamily: '"Silkscreen", monospace',
        backgroundColor: "#00000055",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });

    detranButton.on("pointerover", () => detranButton.setColor("#ffff00"));
    detranButton.on("pointerout", () => detranButton.setColor("#00ffff"));
    detranButton.on("pointerdown", () => {
      window.open("https://www.detran.ce.gov.br/", "_blank");
    });

    this.showMainCredits();
  }

  showMainCredits() {
    const { width, height } = this.scale;

    const container = this.add.container(width / 2, height);

    const title = this.add
      .text(0, 0, "CNH POPULAR - O JOGO", {
        fontSize: "40px",
        color: "#ffff00",
        fontFamily: '"Silkscreen", monospace',
        align: "center",
      })
      .setOrigin(0.5);
    container.add(title);

    const sections = [
      {
        title: "DESENVOLVIDO POR",
        names: ["Laboratório Íris"],
      },
      {
        title: "PROGRAMAÇÃO",
        names: ["Vinicius Secundino", "Mariana Castro", "Joab Rocha"],
      },
      {
        title: "ARTE E DESIGN",
        names: [
          "Vinicius Secundino",
          "Mariana Castro",
          "Joab Rocha",
          "Isac Bernardo",
        ],
      },
      {
        title: "HISTÓRIA",
        names: ["Vinicius Secundino", "Mariana Castro", "Joab Rocha"],
      },
      {
        title: "MÚSICAS",
        names: ["HeatleyBros", "Kevin MacLeod"],
      },
    ];

    let currentY = 80;

    sections.forEach((section) => {
      const sectionTitle = this.add
        .text(0, currentY, section.title, {
          fontSize: "28px",
          color: "#00ffff",
          fontFamily: '"Silkscreen", monospace',
          align: "center",
        })
        .setOrigin(0.5);
      container.add(sectionTitle);
      currentY += 40;

      section.names.forEach((name) => {
        const nameText = this.add
          .text(0, currentY, name, {
            fontSize: "24px",
            color: "#ffff00",
            fontFamily: '"Silkscreen", monospace',
            align: "center",
          })
          .setOrigin(0.5);
        container.add(nameText);
        currentY += 30;
      });

      currentY += 50;
    });

    const ad = this.add
      .text(0, currentY, "Acesse o site do DETRAN para mais informações", {
        fontSize: "20px",
        color: "#ffff00",
        fontFamily: '"Silkscreen", monospace',
        align: "center",
      })
      .setOrigin(0.5);
    container.add(ad);

    const logos = this.add.image(-80, currentY + 100, "logo");

    logos.setScale(0.5);

    const logoDetran = this.add.image(200, currentY + 100, "logo-detran");

    logoDetran.setScale(0.1);

    container.add(logos);

    container.add(logoDetran);

    this.tweens.add({
      targets: container,
      y: -currentY + 100,
      duration: 30000,
      ease: "Linear",
      onComplete: () => {
        this.restartCnhGame();
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
      this.restartCnhGame();
    });
  }

  restartCnhGame() {
    this.sound.stopAll();
    resetPlayerState();
    this.scene.start("GameScene", { restart: true });
  }
}
