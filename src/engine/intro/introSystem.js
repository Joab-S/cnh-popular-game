import { pressKeyIcon } from "../utils/pressE.js";

export class IntroSystem {
  constructor(scene) {
    this.scene = scene;
    this.showingCover = true;
    this.showingInstructions = false;
    this.currentInstruction = 0;
    this.canAdvance = true;
    this.eKeyJustPressed = false;
    this.introCompleted = false;

    this.instructions = [
      "Bem-vindo ao CNH Popular - O Jogo!",
      "Neste jogo, você vai vivenciar a jornada para obter sua Carteira Nacional de Habilitação através do programa CNH popular do Governo do Estado do Ceará.",
      "Você precisará passar por todas as etapas: coleta de documentos, exame médico, aulas teóricas, aulas práticas e provas finais.",
      "CONTROLS_SCREEN",
      "Explore os ambientes, complete as missões e boa sorte na sua jornada!",
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
    this.introCompleted = false;
  }

  shouldShowIntro() {
    return (
      (this.showingCover || this.showingInstructions) && !this.introCompleted
    );
  }

  showCoverScreen() {
    const { width, height } = this.scene.scale;

    this.coverImage = this.scene.add
      .image(width / 2, height / 2, "capa")
      .setDisplaySize(width, height)
      .setInteractive();

    this.scene.textures
      .get("capa")
      .setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.scene.textures
      .get("logo")
      .setFilter(Phaser.Textures.FilterMode.LINEAR);

    this.overlayImage = this.scene.add
      .image(width / 2, height / 3 - 120, "logo")
      .setScale(0.5)
      .setDepth(1);

    this.titleText = this.scene.add
      .text(width / 2, height / 3 + 170, "CNH POPULAR - O JOGO", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "48px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(2);

    this.progressText = pressKeyIcon(
      this.scene,
      "Pressione",
      "ou clique na tela para continuar",
      width / 2,
      height - 80,
      "button_action",
      0.15
    );

    this.scene.tweens.add({
      targets: this.progressText,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    const advance = () => {
      if (this.canAdvance) {
        this.canAdvance = false;
        this.advanceFromCover();
      }
    };

    this.coverImage.on("pointerdown", advance);
    this.scene.input.once("pointerdown", advance);
  }

  showInstructionsScreen() {
    const { width, height } = this.scene.scale;

    this.instructionsBg = this.scene.add
      .image(width / 2, height / 2, "capa")
      .setDisplaySize(width, height)
      .setInteractive();

    this.scene.textures
      .get("capa")
      .setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.dialogBox = this.scene.add
      .rectangle(width / 2, height - 230, width - 100, 200, 0xffffff, 0.9)
      .setStrokeStyle(2, 0x000000)
      .setDepth(1);

    this.renderCurrentInstruction(width, height);
    this.progressText = pressKeyIcon(
      this.scene,
      "Pressione",
      "ou clique na tela para continuar",
      width / 2,
      height - 80,
      "button_action",
      0.15
    );

    this.scene.tweens.add({
      targets: this.progressText,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.createBackButton();

    const next = () => {
      if (this.canAdvance) {
        this.canAdvance = false;
        this.nextInstruction();
      }
    };
    this.instructionsBg.on("pointerdown", next);
    this.scene.input.on("pointerdown", next);
  }

  renderCurrentInstruction(width, height) {
    if (this.instructionDialog) {
      this.instructionDialog.destroy();
      this.instructionDialog = null;
    }
    if (this.visualControls) {
      this.visualControls.forEach((el) => el.destroy());
      this.visualControls = null;
    }

    const current = this.instructions[this.currentInstruction];

    if (current === "CONTROLS_SCREEN") {
      this.renderControlsScreen(width, height);
    } else {
      this.instructionDialog = this.scene.add
        .text(width / 2, height - 230, current, {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "18px",
          color: "#000000",
          wordWrap: { width: width - 150 },
          align: "center",
          lineSpacing: 10,
        })
        .setOrigin(0.5)
        .setDepth(2);
    }
  }

  nextInstruction() {
    if (this.visualControls) {
      this.visualControls.forEach((el) => el.destroy());
      this.visualControls = null;
    }

    this.currentInstruction++;

    this.createBackButton();

    if (this.currentInstruction < this.instructions.length) {
      const { width, height } = this.scene.scale;
      this.renderCurrentInstruction(width, height);

      if (this.progressText) this.progressText.destroy();
      this.progressText = pressKeyIcon(
        this.scene,
        "Pressione",
        "ou clique na tela para continuar",
        width / 2,
        height - 80,
        "button_action",
        0.15
      );

      this.scene.tweens.add({
        targets: this.progressText,
        alpha: 0.2,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

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
    this.introCompleted = true;
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
    if (this.progressText) this.progressText.destroy();
    this.scene.input.off("pointerdown");
  }

  cleanupInstructionsScreen() {
    if (this.instructionsBg) this.instructionsBg.destroy();
    if (this.dialogBox) this.dialogBox.destroy();
    if (this.instructionDialog) this.instructionDialog.destroy();
    if (this.progressText) this.progressText.destroy();
    if (this.visualControls) {
      this.visualControls.forEach((el) => el.destroy());
      this.visualControls = null;
    }
    if (this.backButton) {
      this.backButton.destroy();
      this.backButton = null;
    }
    this.scene.input.off("pointerdown");
  }

  backInstruction() {
    if (this.currentInstruction > 0) {
      this.currentInstruction--;

      const { width, height } = this.scene.scale;

      this.renderCurrentInstruction(width, height);

      if (this.instructionDialog) {
        this.instructionDialog.setText(
          this.instructions[this.currentInstruction]
        );
      }

      if (this.progressText) this.progressText.destroy();
      this.progressText = pressKeyIcon(
        this.scene,
        "Pressione",
        "ou clique na tela para continuar",
        width / 2,
        height - 80,
        "button_action",
        0.15
      );

      this.scene.tweens.add({
        targets: this.progressText,
        alpha: 0.2,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      if (this.currentInstruction <= 0) {
        if (this.backButton) {
          this.backButton.destroy();
          this.backButton = null;
        }
      }
    }

    this.scene.time.delayedCall(300, () => {
      this.canAdvance = true;
    });
  }

  update() {
    if (this.introCompleted) return false;

    if (!this.scene.keys || !this.scene.keys.E) return this.shouldShowIntro();

    const eKeyPressed = this.scene.keys.E.isDown;

    if (
      this.showingCover &&
      eKeyPressed &&
      this.canAdvance &&
      !this.eKeyJustPressed
    ) {
      this.eKeyJustPressed = true;
      this.canAdvance = false;
      this.advanceFromCover();
      return true;
    }

    if (
      this.showingInstructions &&
      eKeyPressed &&
      this.canAdvance &&
      !this.eKeyJustPressed
    ) {
      this.eKeyJustPressed = true;
      this.canAdvance = false;
      this.nextInstruction();
      return true;
    }

    if (!eKeyPressed) this.eKeyJustPressed = false;

    return this.shouldShowIntro();
  }

  getCurrentState() {
    return {
      showingCover: this.showingCover,
      showingInstructions: this.showingInstructions,
      introCompleted: this.introCompleted,
    };
  }

  renderControlsScreen(width, height) {
    const title = this.scene.add
      .text(width / 2, this.dialogBox.height - 50, "USE AS TECLAS", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "22px",
        color: "#000000",
      })
      .setOrigin(0.5)
      .setDepth(2);

    const wasd = this.scene.add
      .image(width / 2 - 220, height - 230, "wasd_keys")
      .setScale(0.35)
      .setDepth(2);
    const arrows = this.scene.add
      .image(width / 2 - 80, height - 230, "arrow_keys")
      .setScale(0.35)
      .setDepth(2);

    const moveText = this.scene.add
      .text(width / 2 - 150, height - 160, "para se movimentar", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "16px",
        color: "#000000",
      })
      .setOrigin(0.5)
      .setDepth(2);

    const keyE = this.scene.add
      .image(width / 2 + 180, height - 230, "button_action")
      .setScale(0.2)
      .setDepth(2);

    const interactText = this.scene.add
      .text(width / 2 + 180, height - 160, "para interagir", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "16px",
        color: "#000000",
      })
      .setOrigin(0.5)
      .setDepth(2);

    this.visualControls = [title, wasd, arrows, moveText, keyE, interactText];
  }

  createBackButton() {
    const { width, height } = this.scene.scale;

    if (this.currentInstruction > 0 && !this.backButton) {
      this.backButton = this.scene.add
        .image(width / 2 - width / 2.5, height - 153, "back_arrow_left")
        .setOrigin(0.5)
        .setDepth(3)
        .setScale(0.05)
        .setInteractive({ useHandCursor: true });

      this.backButton.on("pointerover", () => {
        if (this.currentInstruction > 0)
          this.scene.tweens.add({
            targets: this.backButton,
            scale: 0.045,
            duration: 150,
          });
      });
      this.backButton.on("pointerout", () => {
        this.scene.tweens.add({
          targets: this.backButton,
          scale: 0.05,
          duration: 150,
        });
      });
      this.backButton.on("pointerdown", () => {
        if (this.canAdvance) {
          this.canAdvance = false;
          this.backInstruction();
        }
      });
    }
  }
}
