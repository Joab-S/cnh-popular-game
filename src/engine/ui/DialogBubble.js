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
    const padding = 12;
    const boxW = Math.min(520, width - 40);
    const boxH = 110;

    const container = this.scene.add.container(width / 2, height - 160);
    const bg = this.scene.add.rectangle(0, 0, boxW, boxH, 0x000000, 0.75)
      .setStrokeStyle(2, 0xffffff, 0.9)
      .setOrigin(0.5);

    const textObj = this.scene.add.text(0, 0, text, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: boxW - padding * 2 },
      align: 'left'
    }).setOrigin(0.5);

    const hintObj = this.scene.add.text(0, boxH / 2 - 16, 'Pressione E para continuar', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#cccccc'
    }).setOrigin(0.5);

    container.add([bg, textObj, hintObj]);
    container.setDepth(10);

    this.container = container;
    this.textObj = textObj;
    this.hintObj = hintObj;
  }

  updateText(text) {
    if (this.textObj) this.textObj.setText(text);
  }

  destroy() {
    if (this.container) this.container.destroy(true);
  }
}
