import Phaser from "phaser";

const MAX_SEQUENCE_LENGTH = 5;

export default class MemoryGameScene extends Phaser.Scene {
  constructor() {
    super("MemoryGameScene");

    this.sequence = [];
    this.userSequence = [];
    this.buttons = [];
    this.isPlayerTurn = false;
    this.tileColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
  }

  preload() {
    this.load.audio("beep1", "./assets/sounds/beep1.wav");
    this.load.audio("beep2", "./assets/sounds/beep2.wav");
    this.load.audio("beep3", "./assets/sounds/beep3.wav");
    this.load.audio("beep4", "./assets/sounds/beep4.wav");
  }

  create() {
    this.setUpStartScreen();

    this.soundsArray = [
      this.sound.add("beep1"),
      this.sound.add("beep2"),
      this.sound.add("beep3"),
      this.sound.add("beep4"),
    ];
  }

  setUpStartScreen() {
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 150,
        "Teste psicotécnico",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "25px",
          fill: "#fff",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 100,
        "Repita a sequência de cores!",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "25px",
          fill: "#fff",
        }
      )
      .setOrigin(0.5);

    const startText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 100,
        "Clique em qualquer lugar para começar!",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "20px",
          fill: "#ddd",
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.input.once("pointerdown", this.startGame, this);
  }

  startGame() {
    this.children.removeAll();

    this.createGridButtons();

    this.time.delayedCall(1000, () => {
      this.addToSequence();
      this.playSequence();
    });
  }

  createGridButtons() {
    const size = 150;
    const margin = 20;
    const startX = this.scale.width / 2 - size - margin / 2;
    const startY = this.scale.height / 2 - size - margin / 2;

    for (let i = 0; i < 4; i++) {
      const x = startX + (i % 2) * (size + margin);
      const y = startY + Math.floor(i / 2) * (size + margin);

      const button = this.add
        .rectangle(x, y, size, size, this.tileColors[i])
        .setOrigin(0)
        .setInteractive();

      button.originalColor = this.tileColors[i];

      button.on("pointerdown", () => {
        if (!this.isPlayerTurn) return;
        this.flash(button);
        this.soundsArray[i].play();
        this.handlePlayerInput(i);
      });

      this.buttons.push(button);
    }
  }

  addToSequence() {
    const nextIndex = Phaser.Math.Between(0, 3);
    this.sequence.push(nextIndex);
    this.userSequence = [];
  }

  async playSequence() {
    this.isPlayerTurn = false;

    for (let i = 0; i < this.sequence.length; i++) {
      const index = this.sequence[i];
      const button = this.buttons[index];
      const sound = this.soundsArray[index];

      sound.play();
      await this.flash(button);
      await this.sleep(400);
    }

    this.isPlayerTurn = true;
  }

  flash(button) {
    return new Promise((resolve) => {
      button.setFillStyle(0xffffff);
      this.time.delayedCall(200, () => {
        button.setFillStyle(button.originalColor);
        resolve();
      });
    });
  }

  sleep(time) {
    return new Promise((resolve) => this.time.delayedCall(time, resolve));
  }

  handlePlayerInput(index) {
    this.userSequence.push(index);

    const currentStep = this.userSequence.length - 1;

    if (this.userSequence[currentStep] !== this.sequence[currentStep]) {
      this.gameOver();
      return;
    }

    if (this.userSequence.length === this.sequence.length) {
      if (this.sequence.length === MAX_SEQUENCE_LENGTH) {
        this.victory();
        return;
      }

      this.isPlayerTurn = false;
      this.time.delayedCall(800, () => {
        this.addToSequence();
        this.playSequence();
      });
    }
  }

  gameOver() {
    this.cameras.main.shake(200, 0.01);

    const lostRectangle = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      550,
      100,
      0x000000,
      1.0
    );

    const lostText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Você errou! Vamos tentar novamente...",
        {
          fontSize: "20px",
          fill: "#fff",
          fontFamily: '"Silkscreen", monospace',
        }
      )
      .setOrigin(0.5);

    this.sequence = [];
    this.userSequence = [];

    this.time.delayedCall(2000, () => {
      lostText.destroy();
      lostRectangle.destroy();
    });

    this.time.delayedCall(3000, () => {
      this.addToSequence();
      this.playSequence();
    });
  }

  victory() {
    this.children.removeAll();

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 120,
        "Parabéns! Você venceu!",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "20px",
          fill: "#fff",
        }
      )
      .setOrigin(0.5);

    this.isPlayerTurn = false;
  }
}
