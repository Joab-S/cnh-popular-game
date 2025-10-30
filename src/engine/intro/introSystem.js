export class IntroSystem {
  constructor(scene) {
    this.scene = scene;
    this.showingCover = true;
    this.showingInstructions = false;
    this.currentInstruction = 0;
    this.canAdvance = true;
    
    this.instructions = [
      "Bem-vindo ao CNH Popular - O Jogo!",
      "Neste jogo, você vai vivenciar a jornada para obter sua Carteira Nacional de Habilitação através do programa CNH Popular do Ceará.",
      "Você precisará passar por todas as etapas: documentos, aulas teóricas, exames médicos, aulas práticas e as provas finais.",
      "Use as teclas WASD ou setas para se mover e a tecla E para interagir com objetos e personagens.",
      "Explore os ambientes, complete missões e boa sorte na sua jornada!"
    ];

    this.coverImage = null;
    this.overlayImage = null;
    this.titleText = null;
    this.instructionText = null;
    this.instructionsBg = null;
    this.dialogBox = null;
    this.instructionDialog = null;
    this.progressText = null;
  }

  init(data) {
    this.showingCover = data?.showingCover ?? true;
    this.showingInstructions = data?.showingInstructions ?? false;
    this.currentInstruction = 0;
    this.canAdvance = true;
  }

  shouldShowIntro() {
    return this.showingCover || this.showingInstructions;
  }

  showCoverScreen() {
    const { width, height } = this.scene.scale;

    this.coverImage = this.scene.add.image(width / 2, height / 2, "capa")
      .setDisplaySize(width, height)
      .setInteractive();

    this.scene.textures.get("capa").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.scene.textures.get("logo").setFilter(Phaser.Textures.FilterMode.LINEAR);

    this.overlayImage = this.scene.add.image(width / 2, height / 3 - 120, "logo")
      .setScale(0.5)
      .setDepth(1);

    this.titleText = this.scene.add.text(width / 2, height / 3 + 170, 
      "CNH POPULAR - O JOGO", 
      {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "48px",
        color: "#ffffff",
        fontStyle: "bold",
      }
    ).setOrigin(0.5).setDepth(2);

    this.instructionText = this.scene.add.text(width / 2, height - 80, 
      "Pressione E ou clique na tela para continuar", 
      {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "20px",
        color: "#ffffff",
      }
    ).setOrigin(0.5).setDepth(2).setAlpha(0.6);

    this.scene.tweens.add({
      targets: this.instructionText,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    this.coverImage.on("pointerdown", () => {
      if (this.canAdvance) {
        this.canAdvance = false;
        this.advanceFromCover();
      }
    });

    this.scene.input.on("pointerdown", () => {
      if (this.canAdvance) {
        this.canAdvance = false;
        this.advanceFromCover();
      }
    });
  }

  showInstructionsScreen() {
    const { width, height } = this.scene.scale;

    this.instructionsBg = this.scene.add.image(width / 2, height / 2, "capa")
      .setDisplaySize(width, height)
      .setInteractive();

    this.scene.textures.get("capa").setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.dialogBox = this.scene.add.rectangle(width / 2, height - 230, width - 100, 200, 0xffffff, 0.9)
      .setStrokeStyle(2, 0x000000)
      .setDepth(1);

    this.instructionDialog = this.scene.add.text(width / 2, height - 230, 
      this.instructions[this.currentInstruction], 
      {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "18px",
        color: "#000000",
        wordWrap: { width: width - 150 },
        align: "center",
        lineSpacing: 10
      }
    ).setOrigin(0.5).setDepth(2);

    this.progressText = this.scene.add.text(width / 2, height - 80, 
      `Pressione E ou clique na tela para continuar`, 
      {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "16px",
        color: "#ffffff",
      }
    ).setOrigin(0.5).setDepth(2);

    this.scene.tweens.add({
      targets: this.progressText,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    this.instructionsBg.on("pointerdown", () => {
      if (this.canAdvance) {
        this.canAdvance = false;
        this.nextInstruction();
      }
    });

    this.scene.input.on("pointerdown", () => {
      if (this.canAdvance) {
        this.canAdvance = false;
        this.nextInstruction();
      }
    });
  }

  nextInstruction() {
    this.currentInstruction++;
    
    if (this.currentInstruction < this.instructions.length) {
      this.instructionDialog.setText(this.instructions[this.currentInstruction]);
      this.progressText.setText(`Pressione E ou clique na tela para continuar`);
      
      this.scene.time.delayedCall(300, () => {
        this.canAdvance = true;
      });
    } else {
      this.advanceFromInstructions();
    }
  }

  advanceFromCover() {
    this.showingCover = false;
    this.showingInstructions = true;
    this.currentInstruction = 0;
    this.canAdvance = true;
    
    this.cleanupCoverScreen();
    this.scene.time.delayedCall(100, () => {
      this.showInstructionsScreen();
    });
  }

  advanceFromInstructions() {
    this.showingInstructions = false;
    this.cleanupInstructionsScreen();
    
    this.scene.time.delayedCall(100, () => {
      if (this.scene.setupCharacterSelection) {
        this.scene.setupCharacterSelection((character) => {
          this.scene.startGameWithCharacter(character);
        });
      }
    });
  }

  cleanupCoverScreen() {
    if (this.coverImage) this.coverImage.destroy();
    if (this.overlayImage) this.overlayImage.destroy();
    if (this.titleText) this.titleText.destroy();
    if (this.instructionText) this.instructionText.destroy();
    this.scene.input.off("pointerdown");
  }

  cleanupInstructionsScreen() {
    if (this.instructionsBg) this.instructionsBg.destroy();
    if (this.dialogBox) this.dialogBox.destroy();
    if (this.instructionDialog) this.instructionDialog.destroy();
    if (this.progressText) this.progressText.destroy();
    this.scene.input.off("pointerdown");
  }

  update() {
    if (!this.scene.keys) return;

    if (this.showingCover && this.scene.keys.E.isDown && this.canAdvance) {
      this.canAdvance = false;
      this.advanceFromCover();
      return true;
    }

    if (this.showingInstructions && this.scene.keys.E.isDown && this.canAdvance) {
      this.canAdvance = false;
      this.nextInstruction();
      return true;
    }

    return this.shouldShowIntro();
  }

  getCurrentState() {
    return {
      showingCover: this.showingCover,
      showingInstructions: this.showingInstructions
    };
  }
}