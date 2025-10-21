export default class DialogBubble {
  constructor(scene, text) {
    this.scene = scene;
    this.container = null;
    this.textObj = null;
    this.hintObj = null;
    this._create(text);
  }

  _create(text) {
    const { width, height } = this.scene.scale;
    const padding = 8;
    const border = 2;
    const boxW = Math.min(520, width - 40);
    const boxH = 70;
    const scale = 1;

    // === Fundo branco com borda preta e sombra ===
    const g = this.scene.add.graphics();
    
    g.fillStyle(0x000000, 0.3);
    g.fillRect(-boxW / 2 + 3, -boxH / 2 + 3, boxW, boxH);
    
    g.fillStyle(0xffffff, 1);
    g.fillRect(-boxW / 2, -boxH / 2, boxW, boxH);
    
    g.lineStyle(border, 0x000000, 1);
    g.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);

    // === Texto principal ===
    const textObj = this.scene.add.text(0, -8, text, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#000000',
      align: 'center',
      lineSpacing: 6,
      fontWeight: 'bold',
    }).setOrigin(0.5, 0.5);

    // === Texto da dica ===
    const hintObj = this.scene.add.text(
      0,
      boxH / 2 - 18,
      '[E] CONTINUAR',
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#000000',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5, 0.5);

    // === Efeito de piscar ===
    this.scene.tweens.add({
      targets: hintObj,
      alpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // === Container ===
    const container = this.scene.add.container(
      width / 2,
      height - 400,
      [g, textObj, hintObj]
    );

    container.setScrollFactor(0);
    container.setDepth(1000);

    container.setAlpha(0);
    this.scene.tweens.add({
      targets: container,
      alpha: 1,
      duration: 200,
      ease: 'Linear'
    });

    this.container = container;
    this.textObj = textObj;
    this.hintObj = hintObj;
  }

  updateText(text) {
    if (this.textObj) {
      this.textObj.setText(text);
    }
  }

  destroy() {
    if (this.container) {
      this.container.destroy(true);
    }
  }
}