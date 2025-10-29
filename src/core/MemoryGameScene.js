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
    this.currentLevel = 1;
  }

  preload() {
    this.load.audio("beep1", "./assets/sounds/beep1.wav");
    this.load.audio("beep2", "./assets/sounds/beep2.wav");
    this.load.audio("beep3", "./assets/sounds/beep3.wav");
    this.load.audio("beep4", "./assets/sounds/beep4.wav");
    
    // Carregar imagens
    this.load.image("minigame_bg", "./assets/images/minigame_bg.png");
    this.load.image("arrow_up", "./assets/images/arrow_up.png");
    this.load.image("arrow_down", "./assets/images/arrow_down.png");
    this.load.image("arrow_left", "./assets/images/arrow_left.png");
    this.load.image("arrow_right", "./assets/images/arrow_right.png");
  }

  create() {
    // Background com imagem
    this.bg = this.add.image(0, 0, "minigame_bg")
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height);

    // Overlay escuro para melhor contraste
    this.overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.3)
      .setOrigin(0);

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
        "TESTE PSICOTÉCNICO",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "48px",
          fill: "#fff",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 90,
        "Repita a sequência de cores que aparecerá na tela,\nusando as setas ou clicando na cor correspondente.",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "20px",
          fill: "#FFFFFF",
        }
      )
      .setOrigin(0.5);

    const startText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 140,
        "Clique em qualquer canto para começar",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "18px",
          fill: "#fff",
        }
      )
      .setOrigin(0.5);

    // Animação de piscar mais suave
    this.tweens.add({
      targets: startText,
      alpha: 0.4,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    this.input.once("pointerdown", this.startGame, this);
  }

  startGame() {
    this.children.removeAll();
    this.currentLevel = 1;
    
    // Recriar background
    this.bg = this.add.image(0, 0, "minigame_bg")
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height);
    
    this.overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.3)
      .setOrigin(0);

    this.createGridButtons();
    this.setUpKeyboardControls();

    this.time.delayedCall(1000, () => {
      this.addToSequence();
      this.playSequence();
    });
  }

  // MÉTODO QUE ESTAVA FALTANDO!
  addToSequence() {
    const nextIndex = Phaser.Math.Between(0, 3);
    this.sequence.push(nextIndex);
    this.userSequence = [];
    this.currentLevel = this.sequence.length;
  }

  setUpKeyboardControls() {
    // Configurar controles de teclado
    this.keys = this.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT');
    
    // Event listener para as teclas
    this.input.keyboard.on('keydown', (event) => {
      if (!this.isPlayerTurn) return;
      
      let buttonIndex = -1;
      
      switch(event.key) {
        case 'ArrowUp':
          buttonIndex = 1; // Verde - Cima
          break;
        case 'ArrowDown':
          buttonIndex = 2; // Azul - Baixo
          break;
        case 'ArrowLeft':
          buttonIndex = 0; // Vermelho - Esquerda
          break;
        case 'ArrowRight':
          buttonIndex = 3; // Amarelo - Direita
          break;
      }
      
      if (buttonIndex !== -1 && this.buttons[buttonIndex]) {
        this.handleButtonPress(buttonIndex);
      }
    });
  }

  createGridButtons() {
    const size = 120;
    const margin = 20;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Nomes das imagens das setas
    const arrowImages = ["arrow_left", "arrow_up", "arrow_down", "arrow_right"];

    for (let i = 0; i < 4; i++) {
      let x, y;
      
      // Posicionar em cruz (estilo D-pad)
      switch(i) {
        case 0: // Esquerda
          x = centerX - size - margin;
          y = centerY;
          break;
        case 1: // Cima
          x = centerX;
          y = centerY - size - margin;
          break;
        case 2: // Baixo
          x = centerX;
          y = centerY + size + margin;
          break;
        case 3: // Direita
          x = centerX + size + margin;
          y = centerY;
          break;
      }

      // Criar botão com cor de fundo
      const button = this.add
        .rectangle(x, y, size, size, this.tileColors[i], 0.8)
        .setOrigin(0.5)
        .setInteractive()
        .setStrokeStyle(6, 0x000000)
        .setDepth(1);

      // Adicionar imagem da seta
      const arrow = this.add
        .image(x, y, arrowImages[i])
        .setDisplaySize(size * 0.6, size * 0.6)
        .setDepth(2)
        .setAlpha(0.9);

      button.setData("index", i);
      button.originalColor = this.tileColors[i];
      button.originalAlpha = 0.8;
      button.arrow = arrow;

      // Efeitos de hover
      button.on("pointerover", () => {
        if (!this.isPlayerTurn) return;
        button.setStrokeStyle(8, 0xffffff);
        button.setScale(1.05);
      });

      button.on("pointerout", () => {
        button.setStrokeStyle(6, 0x000000);
        button.setScale(1);
        button.arrow.setScale(1);
      });

      button.on("pointerdown", () => {
        if (!this.isPlayerTurn) return;
        this.handleButtonPress(i);
      });

      this.buttons.push(button);
    }

    // Adicionar círculo central
    this.centerDisplay = this.add.circle(centerX, centerY, 70, 0x111133, 0.8)
      .setDepth(3)
      .setStrokeStyle(4, 0xffffff);

    this.centerText = this.add.text(centerX, centerY, "Preste\natenção!", {
      fontFamily: '"Silkscreen", monospace',
      fontSize: "18px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3
    })
    .setOrigin(0.5)
    .setDepth(4);
  }

  handleButtonPress(buttonIndex) {
    const button = this.buttons[buttonIndex];
    this.animateButtonPress(button);
    this.soundsArray[buttonIndex].play();
    this.handlePlayerInput(buttonIndex);
  }

  animateButtonPress(button) {
    this.tweens.add({
      targets: [button, button.arrow],
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 80,
      yoyo: true,
    });
  }

  async playSequence() {
    this.isPlayerTurn = false;

    await this.sleep(800);

    for (let i = 0; i < this.sequence.length; i++) {
      const index = this.sequence[i];
      const button = this.buttons[index];
      const sound = this.soundsArray[index];

      sound.play();
      await this.flash(button);
      await this.sleep(500);
    }

    this.centerText.setText("SUA VEZ!");
    this.centerText.setFontSize(16);
    this.isPlayerTurn = true;
  }

  flash(button) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: [button, button.arrow],
        duration: 200,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 1,
        yoyo: true,
        repeat: 0,
        onStart: () => {
          button.setFillStyle(0xffffff, 1);
          button.arrow.setTint(0x000000);
        },
        onComplete: () => {
          button.setFillStyle(button.originalColor, button.originalAlpha);
          button.arrow.clearTint();
          button.setScale(1);
          resolve();
        },
      });
    });
  }

  sleep(time) {
    return new Promise((resolve) => this.time.delayedCall(time, resolve));
  }

  handlePlayerInput(index) {
    if (!this.isPlayerTurn) return;
    
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
      
      this.time.delayedCall(1500, () => {
        this.addToSequence();
        this.playSequence();
      });
    }
  }

  gameOver() {
    this.cameras.main.shake(300, 0.02);
    this.cameras.main.flash(200, 255, 0, 0);

    this.sequence = [];
    this.userSequence = [];
    this.currentLevel = 1;

    this.time.delayedCall(3000, () => {
      this.centerText.setFill("#ffffff");
      this.startGame();
    });
  }

  victory() {
    this.children.removeAll();

    this.bg = this.add.image(0, 0, "minigame_bg")
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height);

    this.cameras.main.flash(300, 0, 255, 0);
    
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 50,
        "PARABÉNS!",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "48px",
          fill: "#0ff",
          stroke: "#00f",
          strokeThickness: 4
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 20,
        "Você completou todos os níveis!",
        {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "20px",
          fill: "#fff",
        }
      )
      .setOrigin(0.5);

    this.isPlayerTurn = false;

    this.time.delayedCall(3000, () => {
      this.scene.get('GameScene').events.emit("memorygame:end", { victory: true });
    });
  }
}