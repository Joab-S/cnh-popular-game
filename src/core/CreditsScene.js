import Phaser from "phaser";

export default class StarWarsCreditsScene extends Phaser.Scene {
  constructor() {
    super("StarWarsCreditsScene");
  }

  preload() {
    // Carregue aqui um som opcional e uma imagem de fundo, se quiser
    // this.load.audio("credits-theme", "./assets/audio/starwars_style.mp3");
    // this.load.image("stars-bg", "./assets/images/stars_bg.png");
  }

  create() {
    const { width, height } = this.scale;

    // Fundo espacial
    this.add.rectangle(0, 0, width * 2, height * 2, 0x000000).setOrigin(0);
    // Se quiser usar imagem: this.add.image(width/2, height/2, "stars-bg").setOrigin(0.5).setDisplaySize(width, height);

    // Música de fundo (opcional)
    // const music = this.sound.add("credits-theme", { loop: true, volume: 0.5 });
    // music.play();

    // Texto de introdução (como nos filmes)
    const introText = this.add
      .text(
        width / 2,
        height / 2,
        "Há muito tempo, em uma galáxia muito, muito distante...",
        {
          fontSize: "20px",
          color: "#00bfff",
          fontFamily: '"Silkscreen", monospace',
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: introText,
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

    // Título
    const title = this.add
      .text(width / 2, height, "CNH POPULAR - O JOGO", {
        fontSize: "48px",
        color: "#ffff00",
        fontFamily: '"Silkscreen", monospace',
        align: "center",
        wordWrap: { width: width - 100 },
      })
      .setOrigin(0.5);

    // Texto dos créditos (pode personalizar livremente)
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

MÚSICAS
HeatleyBros

AGRADECIMENTOS ESPECIAIS
`;

    // Contêiner para aplicar transformação 3D simulada
    const credits = this.add
      .text(width / 2, height + 600, creditsText, {
        fontSize: "26px",
        color: "#ffff00",
        fontFamily: '"Silkscreen", monospace',
        align: "center",
        lineSpacing: 12,
      })
      .setOrigin(0.5); // inclinação para o efeito de perspectiva

    // Movimento de rolagem
    this.tweens.add({
      targets: [title, credits],
      y: "-=1800", // movimento para cima
      duration: 30000,
      ease: "Linear",
      onComplete: () => {
        this.scene.start("MainMenuScene");
      },
    });

    // Botão para pular os créditos
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
      // this.sound.stopAll();
      this.scene.start("MainMenuScene");
    });
  }
}
