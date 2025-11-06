export default class OrientationOverlay extends Phaser.Scene {
  constructor() {
    super({
      key: "OrientationOverlay",
      active: true,
      visible: true,
      transparent: true,
    });
    this.isPortrait = false;
    this.hideTimer = null;
  }

  create() {
    const { width, height } = this.scale;

    this.overlay = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.85)
      .setOrigin(0)
      .setScrollFactor(0)
      .setVisible(false);

    this.message = this.add
      .text(
        width / 2,
        height / 2,
        "↻ Para uma melhor experiência, vire o celular",
        {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setVisible(false);

    this.updateOrientationState();

    window.addEventListener("resize", () => this.updateOrientationState());
    window.addEventListener("orientationchange", () =>
      this.updateOrientationState()
    );
    this.scale.on("resize", () => this.updateOrientationState());

    this.events.on("postupdate", () => {
      this.scene.bringToTop(this.scene.key);
    });
  }

  updateOrientationState() {
    const portraitNow = window.innerHeight > window.innerWidth;

    if (portraitNow !== this.isPortrait) {
      this.isPortrait = portraitNow;
      if (portraitNow) {
        this.showTemporaryMessage();
      } else {
        this.hideMessage();
      }
    }
  }

  showTemporaryMessage() {
    this.overlay.setVisible(true);
    this.message.setVisible(true);

    if (this.hideTimer) {
      this.hideTimer.remove(false);
    }

    this.hideTimer = this.time.addEvent({
      delay: 2000,
      callback: () => this.hideMessage(),
    });
  }

  hideMessage() {
    this.overlay.setVisible(false);
    this.message.setVisible(false);
  }
}
