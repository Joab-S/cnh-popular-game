export default class Ground {
  constructor(scene) {
    this.scene = scene;
    this.ground = null; // objeto visual invisível com corpo estático
    this.create();
  }

  create() {
    const { width, height } = this.scene.scale;

    if (this.ground) {
      this.ground.destroy();
    }

    // alturas
    const sidewalkH = 30;
    const dividerH  = 4;
    const asphaltH  = 30;
    const yStart = height - (sidewalkH + dividerH + asphaltH);

    // Camadas VISUAIS
    this.scene.add.rectangle(width/2, yStart + sidewalkH/2, width, sidewalkH, 0xaaaaaa).setDepth(1);
    this.scene.add.rectangle(width/2, yStart + sidewalkH + dividerH/2, width, dividerH, 0xffffff).setDepth(1);
    this.scene.add.rectangle(width/2, yStart + sidewalkH + dividerH + asphaltH/2, width, asphaltH, 0x222222).setDepth(0);

    // Piso FÍSICO (usa a faixa da calçada)
    const groundY = yStart + sidewalkH/2;
    const groundRect = this.scene.add.rectangle(width/2, groundY, width, sidewalkH);
    groundRect.setVisible(false);
    this.scene.physics.add.existing(groundRect, true); // estático
    // (Opcional) garante que o corpo bate "por cima"
    groundRect.body.checkCollision.down  = false;
    groundRect.body.checkCollision.left  = true;
    groundRect.body.checkCollision.right = true;
    groundRect.body.checkCollision.up    = true;

    this.ground = groundRect;
  }
}
