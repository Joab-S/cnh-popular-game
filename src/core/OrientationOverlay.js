export default class OrientationOverlay extends Phaser.Scene {
  constructor() {
    super({
      key: "OrientationOverlay",
      active: true,
      visible: true,
      transparent: true,
    });
    this.isPortrait = false;
  }

  create() {
    const { width, height } = this.scale;

    this.overlay = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.85)
      .setOrigin(0)
      .setScrollFactor(0)
      .setVisible(false);

    this.message = this.add
      .text(width / 2, height / 2, "↻ Vire o celular para jogar", {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Primeira checagem
    this.updateOrientationState();

    // Eventos de rotação/redimensionamento
    window.addEventListener("resize", () => this.updateOrientationState());
    window.addEventListener("orientationchange", () => this.updateOrientationState());
    this.scale.on("resize", () => this.updateOrientationState());

    // Mantém o overlay sempre acima
    this.events.on("postupdate", () => {
      this.scene.bringToTop(this.scene.key);
    });

    this.time.addEvent({
      delay: 300,
      loop: true,
      callback: () => {
        if (this.isPortrait) {
          this.enforcePause(); // mantém tudo pausado se estiver em retrato
        }
      },
    });
  }

  updateOrientationState() {
    const portraitNow = window.innerHeight > window.innerWidth;

    // Se mudou de orientação
    if (portraitNow !== this.isPortrait) {
      this.isPortrait = portraitNow;
      this.overlay.setVisible(portraitNow);
      this.message.setVisible(portraitNow);
    }

    // Aplica pausa ou retomada
    if (portraitNow) this.enforcePause();
    else this.resumeAll();
  }

  enforcePause() {
    const scenes = this.scene.manager.scenes;
    for (const s of scenes) {
      const key = s.sys.settings.key;
      if (key === this.scene.key) continue; // ignora o próprio overlay
      const plugin = this.scene;
      if (plugin.isActive(key) && !plugin.isPaused(key)) {
        plugin.pause(key);
      }
    }
  }

  resumeAll() {
    const scenes = this.scene.manager.scenes;
    for (const s of scenes) {
      const key = s.sys.settings.key;
      if (key === this.scene.key) continue;
      const plugin = this.scene;
      if (plugin.isPaused(key)) {
        plugin.resume(key);
      }
    }
  }
}
