export class DirectionArrow {
  constructor(scene) {
    this.scene = scene;
    this.arrow = null;
    this.arrowTimer = null;
    this.arrowTween = null;
    this.reappearTimer = null;
    this.isReappearMode = false;
    this.currentArea = null;
    this.reappearCount = 0;
  }

  show(options = {}) {
    if (this.arrow) return;

    const { 
      scale = 0.08, 
      duration = 4000,
      margin = 50,
      isReappear = false,
      area = null
    } = options;

    if (area && area !== this.currentArea) {
      this.stopReappear();
      this.currentArea = area;
      this.reappearCount = 0;
    }

    const { width, height } = this.scene.scale;
    
    const finalX = width - margin;
    const finalY = height / 2;
    
    this.arrow = this.scene.add.image(finalX, finalY, "arrow_forward")
      .setScale(scale)
      .setDepth(1000)
      .setScrollFactor(0)
      .setAlpha(0);
    
    this.arrowTween = this.scene.tweens.add({
      targets: this.arrow,
      alpha: { from: 0, to: 1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    if (duration > 0) {
      this.arrowTimer = this.scene.time.delayedCall(duration, () => {
        this.hide();
        
        if (this.isReappearMode) {
          this.scheduleReappear(5000, this.currentArea);
        }
      });
    }

    return this;
  }

  showRight(scale = 0.08, duration = 4000, area = null) {
    return this.show({ scale, duration, area });
  }

  hide() {
    if (this.arrowTimer) {
      this.arrowTimer.remove();
      this.arrowTimer = null;
    }

    if (this.arrowTween) {
      this.arrowTween.stop();
      this.arrowTween = null;
    }
    
    if (this.arrow) {
      this.arrow.destroy();
      this.arrow = null;
    }

    return this;
  }

  scheduleReappear(delay = 5000, area = null) {
    if (this.reappearTimer) {
      this.reappearTimer.remove();
    }

    this.isReappearMode = true;
    if (area) this.currentArea = area;
    
    if (this.reappearCount === 0) {
      this.show({ scale: 0.08, duration: 4000, isReappear: true, area: this.currentArea });
      this.reappearCount++;
    } else {
      this.reappearTimer = this.scene.time.delayedCall(delay, () => {
        if (this.isReappearMode && this.scene.playerState?.currentArea === this.currentArea) {
          this.show({ scale: 0.08, duration: 4000, isReappear: true, area: this.currentArea });
          this.reappearCount++;
        }
      });
    }
  }

  stopForNewArea() {
    this.stopReappear();
    this.currentArea = null;
  }

  stopReappear() {
    this.isReappearMode = false;
    if (this.reappearTimer) {
      this.reappearTimer.remove();
      this.reappearTimer = null;
    }
  }

  shouldHideNearCar() {
    if (!this.scene || !this.scene.interactiveObjects) return false;
    
    const car = this.scene.interactiveObjects.find(obj => obj.key === "car_final");
    if (!car || !car.object) return false;

    const distance = Phaser.Math.Distance.Between(
      this.scene.player.x,
      this.scene.player.y,
      car.object.x,
      car.object.y
    );
    
    const proximityDistance = 200;
    
    return distance < proximityDistance;
  }

  shouldShow() {
    if (!this.scene?.playerState) return false;

    if (this.scene.playerState.inDialog) return false;

    const notHasLicense = !this.scene.playerState.hasLicense;
    return this.isReappearMode || notHasLicense;
  }

  update() {
    if (!this.arrow) return;
    
    if (this.shouldHideNearCar()) {
      this.arrow.setVisible(false);
    } else {
      const shouldShow = this.shouldShow() && !this.scene.playerState.inDialog;
      this.arrow.setVisible(shouldShow);
    }

    if (this.arrow.visible && this.target) {
      this.updateArrowPosition();
    }
  }

  destroy() {
    this.stopReappear();
    this.hide();
    this.scene = null;
  }
}

export function createDirectionArrow(scene) {
  return new DirectionArrow(scene);
}