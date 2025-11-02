import Phaser from "phaser";
import { CONFIG_SONG } from "../../core/config";
import { pressKeyIcon } from "../utils/pressE";

export default class StartCarGameScene extends Phaser.Scene {
  constructor(scene) {
    super("StartCarGameScene");

    this.scene = scene;
    this.showingCover = true;
    this.showingInstructions = false;
    this.currentInstruction = 0;
    this.canAdvance = true;
    this.eKeyJustPressed = false;
    this.introCompleted = false;

    this.instructions = [
      "Bem-vindo à prova prática!",
      "Aqui você deve seguir as direções indicadas pela seta laranja e concluir o trajeto sem cometer infrações",
      "Você deve respeitar os semáforos e os limites da rua",
      "CONTROLS_SCREEN",
      "Boa sorte na prova!",
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

  preload() {
    this.load.image("start-bg", "./assets/images/start_bg.png");

    this.load.audio("car_game_theme", "./assets/sounds/car_game_theme.mp3");

    this.load.image("arrow_keys", "./assets/images/arrow_keys.png");
    this.load.image("wasd_keys", "./assets/images/wasd_keys.png");
    this.load.image("back_arrow_left", "./assets/images/seta-esquerda.png");
    this.load.image("button_action_2", "./assets/images/button-action-2.png");
    this.load.image("button_left_2", "./assets/images/button-left-2.png");
    this.load.image("button_right_2", "./assets/images/button-right-2.png");
    this.load.image("button_a", "./assets/images/button-a.png");
    this.load.image("button_d", "./assets/images/button-d.png");

    this.load.image("button_gas", "./assets/images/pedal-gas.png");
    this.load.image("button_left", "./assets/images/button-left.png");
    this.load.image("button_right", "./assets/images/button-right.png");
    this.load.image("button_brake", "./assets/images/pedal-brake.png");
    this.load.image("finish-line", "./assets/images/faixa_quadriculada.png");
  }

  create() {
    this.keys = this.input.keyboard.addKeys({
      E: Phaser.Input.Keyboard.KeyCodes.E,
    });

    this.showInstructionsScreen();

    this.sound.stopAll();

    this.sound.play("car_game_theme", CONFIG_SONG);

    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 160, "Prova Prática", {
        fontSize: "64px",
        color: "black",
        fontFamily: '"Silkscreen", "Courier New", monospace',
      })
      .setOrigin(0.5);
  }

  update() {
    if (this.introCompleted) return false;

    const eKeyPressed = this.keys.E.isDown;

    if (eKeyPressed && this.canAdvance && !this.eKeyJustPressed) {
      this.eKeyJustPressed = true;
      this.canAdvance = false;
      this.nextInstruction();
      return true;
    }

    if (!eKeyPressed) this.eKeyJustPressed = false;
  }

  showInstructionsScreen() {
    const { width, height } = this.scale;

    this.instructionsBg = this.add
      .image(width / 2, height / 2, "start-bg")
      .setDisplaySize(width, height)
      .setInteractive();

    this.textures.get("start-bg").setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.dialogBox = this.add
      .rectangle(width / 2, height - 230, width - 100, 200, 0x000000, 0.7)
      .setStrokeStyle(3, 0xffffff)
      .setDepth(1);

    this.renderCurrentInstruction(width, height);
    this.progressText = pressKeyIcon(
      this,
      "Pressione",
      "ou clique na tela para continuar",
      width / 2,
      height - 80,
      "button_action_2",
      0.15
    );

    this.tweens.add({
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
    this.input.on("pointerdown", next);
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
      this.instructionDialog = this.add
        .text(width / 2, height - 230, current, {
          fontFamily: '"Silkscreen", monospace',
          fontSize: "18px",
          color: "#ffffff",
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
      const { width, height } = this.scale;
      this.renderCurrentInstruction(width, height);

      if (this.progressText) this.progressText.destroy();
      this.progressText = pressKeyIcon(
        this,
        "Pressione",
        "ou clique na tela para continuar",
        width / 2,
        height - 80,
        "button_action_2",
        0.15
      );

      this.tweens.add({
        targets: this.progressText,
        alpha: 0.2,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      this.time.delayedCall(300, () => {
        this.canAdvance = true;
      });
    } else {
      this.advanceFromInstructions();
    }
  }

  advanceFromInstructions() {
    this.showingInstructions = false;
    this.introCompleted = true;
    this.scene.start("CarGameScene");
  }

  createBackButton() {
    const { width, height } = this.scale;

    if (this.currentInstruction > 0 && !this.backButton) {
      this.backButton = this.add
        .image(width / 2 - width / 2.5, height - 153, "back_arrow_left")
        .setOrigin(0.5)
        .setDepth(3)
        .setScale(0.05)
        .setInteractive({ useHandCursor: true });

      this.backButton.on("pointerover", () => {
        if (this.currentInstruction > 0)
          this.tweens.add({
            targets: this.backButton,
            scale: 0.045,
            duration: 150,
          });
      });
      this.backButton.on("pointerout", () => {
        this.tweens.add({
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

  backInstruction() {
    if (this.currentInstruction > 0) {
      this.currentInstruction--;

      const { width, height } = this.scale;

      this.renderCurrentInstruction(width, height);

      if (this.instructionDialog) {
        this.instructionDialog.setText(
          this.instructions[this.currentInstruction]
        );
      }

      if (this.progressText) this.progressText.destroy();
      this.progressText = pressKeyIcon(
        this,
        "Pressione",
        "ou clique na tela para continuar",
        width / 2,
        height - 80,
        "button_action_2",
        0.15
      );

      this.tweens.add({
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

    this.time.delayedCall(300, () => {
      this.canAdvance = true;
    });
  }

  renderControlsScreen(width, height) {
    const title = this.add
      .text(width / 2, this.dialogBox.height - 50, "USE OS BOTÕES", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "22px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(2);

    const arrowLeft = this.add
      .image(width / 2 - 260, height - 230, "button_left")
      .setScale(0.15)
      .setDepth(2);

    const arrowRight = this.add
      .image(width / 2 - 180, height - 230, "button_right")
      .setScale(0.15)
      .setDepth(2);

    const controls = this.add
      .text(width / 2 - 220, height - 160, "para controlar", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(2);

    const gas = this.add
      .image(width / 2, height - 230, "button_gas")
      .setScale(0.15)
      .setDepth(2);

    const moveText = this.add
      .text(width / 2, height - 160, "para acelerar", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(2);

    const brake = this.add
      .image(width / 2 + 220, height - 230, "button_brake")
      .setScale(0.15)
      .setDepth(2);

    const interactText = this.add
      .text(width / 2 + 220, height - 160, "para freiar/ré", {
        fontFamily: '"Silkscreen", monospace',
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(2);

    this.visualControls = [title, gas, moveText, brake, interactText, arrowLeft, arrowRight, controls];
  }
}
