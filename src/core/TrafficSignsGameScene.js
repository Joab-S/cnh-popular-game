export default class TrafficSignsGameScene extends Phaser.Scene {
  constructor() {
    super('TrafficSignsGameScene');
    this.score = 0;
    this.maxScore = 20;
    this.isGameActive = false;
    this.isWaitingToStart = true;
    this.signs = [];
    this.spawnTimer = null;
    this.activeGoSign = null;
    this.spaceKey = null;
    this.enterKey = null;
    this.startScreenTexts = [];
    this.spaceKeyCooldown = false;
  }

  preload() {
    this.load.image("sign_go", "./assets/images/placa_siga.png");
    this.load.image("sign_stop", "./assets/images/placa_pare.png");
    this.load.image("sign_pedestrian", "./assets/images/placa_pedestre.png");
    this.load.image("sign_prohibited", "./assets/images/placa_proibido.png");
    this.load.image("sign_roundabout", "./assets/images/placa_rotatoria.png");
    this.load.image("sign_curvy", "./assets/images/placa_sinuoso.png");

    this.load.bitmapFont('pixelFont', './assets/fonts/pixelFont.png', './assets/fonts/pixelFont.ttf');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1b2838);
    
    this.createGridPattern();
    
    this.setupStartScreen();
    
    // Configurar as teclas
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spaceKey.on('down', this.handleSpacePress, this);
    
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.enterKey.on('down', this.handleEnterPress, this);
    
    this.input.on('gameobjectdown', this.handleSignClick, this);
  }

  createGridPattern() {
    const { width, height } = this.scale;
    const gridSize = 50;
    
    for (let x = 0; x < width; x += gridSize) {
      this.add.line(x, 0, 0, 0, 0, height, 0x2d3047).setAlpha(0.1);
    }
    for (let y = 0; y < height; y += gridSize) {
      this.add.line(0, y, 0, 0, width, 0, 0x2d3047).setAlpha(0.1);
    }
  }

  setupStartScreen() {
    const { width, height } = this.scale;

    const titleText = this.add.text(width / 2, height / 2 - 80, 'EXAME TEÓRICO', {
      fontSize: '32px',
      fill: '#4cc9f0',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    this.startScreenTexts.push(titleText);

    const instructionText = this.add.text(width / 2, height / 2 - 20, 'Pressione BARRA DE ESPAÇO ou CLIQUE NA PLACA sempre que a placa "Siga Adiante" aparecer', {
      fontSize: '18px',
      fill: '#e2e2e2',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: '300'
    }).setOrigin(0.5).setAlpha(0.9);
    this.startScreenTexts.push(instructionText);

    this.startText = this.add.text(width / 2, height / 2 + 60, 'Pressione ENTER para começar', {
      fontSize: '24px',
      fill: '#4ade80',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    this.startScreenTexts.push(this.startText);

    this.tweens.add({
      targets: this.startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  setupGameUI() {
    const { width } = this.scale;

    this.scoreText = this.add.text(width / 2, 30, `${this.score}/${this.maxScore}`, {
      fontSize: '32px',
      fill: '#e2e2e2',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: '300'
    }).setOrigin(0.5);

    this.instructionText = this.add.text(width / 2, 70, 'Pressione BARRA DE ESPAÇO quando a placa "Siga Adiante" aparecer', {
      fontSize: '16px',
      fill: '#e2e2e2',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: '300'
    }).setOrigin(0.5).setAlpha(0.8);
  }

  handleEnterPress() {
    if (this.isWaitingToStart) {
      this.startGame();
    }
  }

  startGame() {
    this.isWaitingToStart = false;
    this.isGameActive = true;
    
    this.removeStartScreen();
    
    this.setupGameUI();
    
    this.startSignSpawning();
  }

  removeStartScreen() {
    this.startScreenTexts.forEach(text => {
      if (text && typeof text.destroy === 'function') {
        text.destroy();
      }
    });
    this.startScreenTexts = [];
    
    this.tweens.killTweensOf(this.startText);
  }

  startSignSpawning() {
    for (let i = 0; i < 3; i++) {
      this.spawnSign();
    }
    
    this.spawnTimer = this.time.addEvent({
      delay: 600,
      callback: this.spawnSign,
      callbackScope: this,
      loop: true
    });
  }

  spawnSign() {
    if (!this.isGameActive) return;
    
    const { width, height } = this.scale;
    
    const random = Phaser.Math.Between(1, 100);
    let texture, isGoodSign;

    if (random <= 40 && !this.activeGoSign) {
      texture = 'sign_go';
      isGoodSign = true;
    } else if (random <= 60) {
      texture = 'sign_stop';
      isGoodSign = false;
    } else if (random <= 75) {
      texture = 'sign_prohibited';
      isGoodSign = false;
    } else if (random <= 85) {
      texture = 'sign_pedestrian';
      isGoodSign = false;
    } else if (random <= 95) {
      texture = 'sign_roundabout';
      isGoodSign = false;
    } else {
      texture = 'sign_curvy';
      isGoodSign = false;
    }

    if (!this.activeGoSign && !isGoodSign && Phaser.Math.Between(1, 100) <= 30) {
      texture = 'sign_go';
      isGoodSign = true;
    }
    
    const position = this.findNonOverlappingPosition();
    if (!position) {
      console.log('Não foi possível encontrar posição livre para nova placa');
      return;
    }
    
    const { x, y } = position;
    
    const sign = this.add.image(x, y, texture)
      .setInteractive({ useHandCursor: true })
      .setData('isGoodSign', isGoodSign)
      .setData('type', texture)
      .setData('alreadyScored', false);
    
    const baseScale = 0.12;
    const scaleVariation = Phaser.Math.FloatBetween(0.9, 1.1);
    const finalScale = baseScale * scaleVariation;
    
    sign.setScale(0);
    
    sign.radius = Math.max(sign.width, sign.height) * finalScale * 0.6;

    this.tweens.add({
      targets: sign,
      scaleX: finalScale,
      scaleY: finalScale,
      duration: 150,
      ease: 'Back.out'
    });
    
    this.signs.push(sign);

    if (isGoodSign) {
      this.activeGoSign = sign;
    }

    const lifeTime = Phaser.Math.Between(1200, 2000);

    this.time.delayedCall(lifeTime, () => {
      this.removeSign(sign);
    });
  }

  findNonOverlappingPosition() {
    const { width, height } = this.scale;
    const maxAttempts = 50;
    const minDistance = 120;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(150, height - 100);
      
      let overlaps = false;
      
      for (const existingSign of this.signs) {
        const distance = Phaser.Math.Distance.Between(x, y, existingSign.x, existingSign.y);
        if (distance < minDistance) {
          overlaps = true;
          break;
        }
      }
      
      if (!overlaps) {
        return { x, y };
      }
    }
    
    return null;
  }

  handleSpacePress() {
    if (!this.isGameActive || this.isWaitingToStart || this.spaceKeyCooldown) return;
    
    if (this.activeGoSign) {
      this.handleCorrectSpacePress();
    } else {
      this.handleWrongSpacePress();
    }
  }

  handleCorrectSpacePress() {
    const sign = this.activeGoSign;
    this.scoreForSign(sign);
  }

  handleSignClick(pointer, gameObject) {
    if (!this.isGameActive || this.isWaitingToStart) return;
    
    const isGoodSign = gameObject.getData('isGoodSign');
    
    if (isGoodSign) {
      this.scoreForSign(gameObject);
    } else {
      this.handleWrongClick(gameObject);
    }
  }

  scoreForSign(sign) {
    if (sign.getData('alreadyScored')) {
      return;
    }
    
    sign.setData('alreadyScored', true);
    
    this.spaceKeyCooldown = true;
    this.time.delayedCall(300, () => {
      this.spaceKeyCooldown = false;
    });
    
    this.score++;
    this.scoreText.setText(`${this.score}/${this.maxScore}`);
    
    this.tweens.add({
      targets: sign,
      scaleX: sign.scaleX * 1.3,
      scaleY: sign.scaleY * 1.3,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        this.removeSign(sign);
      }
    });
    
    this.showFeedback(sign.x, sign.y, '+1', 0x4cc9f0);
    
    if (this.score >= this.maxScore) {
      this.endGame(true);
    }
  }

  handleWrongSpacePress() {
    if (this.spaceKeyCooldown) return;
    
    this.spaceKeyCooldown = true;
    this.time.delayedCall(300, () => {
      this.spaceKeyCooldown = false;
    });
    
    this.score = Math.max(0, this.score - 1);
    this.scoreText.setText(`${this.score}/${this.maxScore}`);

    this.cameras.main.shake(200, 0.005);

    this.showFeedback(this.scale.width / 2, this.scale.height - 50, '-1', 0xf72585);
  }

  handleWrongClick(sign) {
    this.score = Math.max(0, this.score - 1);
    this.scoreText.setText(`${this.score}/${this.maxScore}`);
    
    this.tweens.add({
      targets: sign,
      scaleX: sign.scaleX * 0.7,
      scaleY: sign.scaleY * 0.7,
      duration: 250,
      yoyo: true
    });

    this.cameras.main.shake(200, 0.005);
    
    this.showFeedback(sign.x, sign.y, '-1', 0xf72585);
  }

  showFeedback(x, y, text, color) {
    const feedback = this.add.text(x, y - 40, text, {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: feedback,
      y: y - 80,
      alpha: 0,
      duration: 1000,
      onComplete: () => feedback.destroy()
    });
  }

  removeSign(sign) {
    if (!sign.active) return;

    if (this.activeGoSign === sign) {
      this.activeGoSign = null;
    }
    
    this.tweens.add({
      targets: sign,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 120,
      onComplete: () => {
        const index = this.signs.indexOf(sign);
        if (index > -1) {
          this.signs.splice(index, 1);
        }
        sign.destroy();
      }
    });
  }

  endGame(isVictory) {
    this.isGameActive = false;
    
    if (this.spawnTimer) this.spawnTimer.remove();
    
    this.signs.forEach(sign => sign.destroy());
    this.signs = [];
    this.activeGoSign = null;
    
    const { width, height } = this.scale;
    
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000)
      .setAlpha(0.8);
    
    const resultDisplay = this.add.text(width / 2, height / 2 - 30, 'PARABÉNS!', {
      fontSize: '48px',
      fill: '#4cc9f0',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: '300'
    }).setOrigin(0.5);
    
    const scoreDisplay = this.add.text(width / 2, height / 2 + 30, 
      `Pontuação: ${this.score}/${this.maxScore}`, {
      fontSize: '24px',
      fill: '#e2e2e2',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: '300'
    }).setOrigin(0.5);
  }

  update() {
    //
  }
}