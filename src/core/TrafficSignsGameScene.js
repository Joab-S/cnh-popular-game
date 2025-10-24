export default class TrafficSignsGameScene extends Phaser.Scene {
  constructor() {
    super('TrafficSignsGameScene');
    this.score = 0;
    this.maxScore = 1;
    this.isGameActive = false;
    this.isWaitingToStart = true;
    this.signs = [];
    this.spawnTimer = null;
    this.targetSign = null;
    this.targetSignType = null;
    this.spaceKey = null;
    this.enterKey = null;
    this.startScreenTexts = [];
    this.spaceKeyCooldown = false;
    this.allSignTypes = [
      { key: 'sign_go', name: 'Siga Adiante' },
      { key: 'sign_stop', name: 'Pare' },
      { key: 'sign_pedestrian', name: 'Pedestre' },
      { key: 'sign_prohibited', name: 'Proibido' },
      { key: 'sign_roundabout', name: 'Rotatória' },
      { key: 'sign_curvy', name: 'Via Sinuosa' }
    ];
  }

  preload() {
    this.load.image('bg_game_1', './assets/images/bg_game_1.png');
    this.load.image("sign_go", "./assets/images/placa_siga.png");
    this.load.image("sign_stop", "./assets/images/placa_pare.png");
    this.load.image("sign_pedestrian", "./assets/images/placa_pedestre.png");
    this.load.image("sign_prohibited", "./assets/images/placa_proibido.png");
    this.load.image("sign_roundabout", "./assets/images/placa_rotatoria.png");
    this.load.image("sign_curvy", "./assets/images/placa_sinuoso.png");
  }

  create() {
    const { width, height } = this.scale;
    
    this.add.image(width / 2, height / 2, 'bg_game_1').setDisplaySize(width, height);
    
    this.setupStartScreen();
    
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spaceKey.on('down', this.handleSpacePress, this);

    this.gameOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000)
    .setAlpha(0)
    .setDepth(0);

    this.input.on('gameobjectdown', this.handleSignClick, this);
  }

  setupStartScreen() {
    const { width, height } = this.scale;

    const randomIndex = Phaser.Math.Between(0, this.allSignTypes.length - 1);
    this.targetSignType = this.allSignTypes[randomIndex];

    const titleText = this.add.text(width / 2, height / 2 - 170, 'EXAME TEÓRICO', {
        fontFamily: '"Silkscreen", "Courier New", monospace',
        fontSize: '28px',
        color: '#000000',
        fontWeight: 'bold',
        align: 'center',
    }).setOrigin(0.5);

    this.startScreenTexts.push(titleText);

    const targetSignImage = this.add.image(width / 2, height / 2 - 100, this.targetSignType.key)
      .setScale(0.08);
    this.startScreenTexts.push(targetSignImage);

    const instructionText = this.add.text(width / 2, height / 2 - 40, `Pressione a BARRA DE ESPAÇO ou clique na placa "${this.targetSignType.name}" quando ela aparecer`, {
      fontSize: '18px',
      color: '#000000',
      fontFamily: '"Silkscreen", "Courier New", monospace',
      fontWeight: '300',
      wordWrap: { width: width * 0.8 },
      align: 'center'
    }).setOrigin(0.5).setAlpha(0.9);
    
    this.startScreenTexts.push(instructionText);

    this.startText = this.add.text(width / 2, height / 2 + 200, 'Clique em qualquer lugar para começar', {
      fontSize: '18px',
      color: '#000000',
      fontFamily: '"Silkscreen", "Courier New", monospace',
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

    this.input.once('pointerdown', this.startGame, this);
  }

  setupGameUI() {
    const { width } = this.scale;

    this.scoreText = this.add.text(width / 2, 30, `${this.score}/${this.maxScore}`, {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: '"Silkscreen", "Courier New", monospace',
      fontWeight: '300'
    }).setOrigin(0.5);
  }

  startGame() {
    this.isWaitingToStart = false;
    this.isGameActive = true;

    this.tweens.add({
      targets: this.gameOverlay,
      alpha: 0.6,
      duration: 500,
      ease: 'Power2'
    });
    
    this.removeStartScreen();
    
    this.setupGameUI();
    
    this.startSignSpawning();
  }

  removeStartScreen() {
    this.startScreenTexts.forEach(element => {
      if (element && typeof element.destroy === 'function') {
        element.destroy();
      }
    });
    this.startScreenTexts = [];
    
    if (this.startText && typeof this.startText.destroy === 'function') {
      this.startText.destroy();
    }
    
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
    let texture, isTargetSign;

    if (random <= 40 && !this.targetSign) {
      texture = this.targetSignType.key;
      isTargetSign = true;
    } else {
      const nonTargetSigns = this.allSignTypes.filter(sign => sign.key !== this.targetSignType.key);
      const randomIndex = Phaser.Math.Between(0, nonTargetSigns.length - 1);
      const randomSign = nonTargetSigns[randomIndex];
      texture = randomSign.key;
      isTargetSign = false;
    }

    if (this.targetSign && isTargetSign) {
      const nonTargetSigns = this.allSignTypes.filter(sign => sign.key !== this.targetSignType.key);
      const randomIndex = Phaser.Math.Between(0, nonTargetSigns.length - 1);
      const randomSign = nonTargetSigns[randomIndex];
      texture = randomSign.key;
      isTargetSign = false;
    }
    
    const position = this.findNonOverlappingPosition();
    if (!position) {
      console.log('Não foi possível encontrar posição livre para nova placa');
      return;
    }
    
    const { x, y } = position;
    
    const sign = this.add.image(x, y, texture)
      .setInteractive({ useHandCursor: true })
      .setData('isTargetSign', isTargetSign)
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

    if (isTargetSign) {
      this.targetSign = sign;
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
    
    if (this.targetSign) {
      this.handleCorrectSpacePress();
    } else {
      this.handleWrongSpacePress();
    }
  }

  handleCorrectSpacePress() {
    const sign = this.targetSign;
    this.scoreForSign(sign);
  }

  handleSignClick(pointer, gameObject) {
    if (!this.isGameActive || this.isWaitingToStart) return;
    
    const isTargetSign = gameObject.getData('isTargetSign');
    
    if (isTargetSign) {
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
      color: '#ffffff',
      fontFamily: '"Silkscreen", "Courier New", monospace',
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

    if (this.targetSign === sign) {
      this.targetSign = null;
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
    this.targetSign = null;
    
    const { width, height } = this.scale;
    
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000)
      .setAlpha(0.8);
    
    const resultDisplay = this.add.text(width / 2, height / 2 - 30, 'PARABÉNS!', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: '"Silkscreen", "Courier New", monospace',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    const scoreDisplay = this.add.text(width / 2, height / 2 + 30, 
      `Pontuação: ${this.score}/${this.maxScore}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: '"Silkscreen", "Courier New", monospace',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.events.emit('gameEnded', { victory: isVictory, score: this.score });
  }

  update() {
    //
  }
}