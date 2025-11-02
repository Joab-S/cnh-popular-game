import Ground from "../engine/physics/Ground.js";
import * as CameraSystem from "../engine/camera/cameraSystem.js";
import {
  createPlayerState,
  getPlayerStateInstance,
} from "../engine/player/playerState.js";
import {
  setupPlayer,
  updatePlayerMovement,
} from "../engine/player/playerController.js";
import { setupUI, updateUI } from "../engine/ui/uiSystem.js";
import {
  setupTransitions,
  checkTransitions,
} from "../engine/transition/transitionSystem.js";
import {
  setupDocuments,
  updateDocuments,
} from "../phases/phase1_home/documentSystem.js";
import { updatePhase2 } from "../phases/phase2_city/SelectionSystem.js";
import InteractiveObject from "../engine/interaction/InteractiveObject.js";
import { updateGenericInteractions } from "../engine/interaction/interactionSystem.js";
import { AREAS, CONFIG_SONG, PHYSICS_DEBUG, WORLD_SIZE } from "./config.js";

import {
  setupCharacterSelection,
  startGameWithCharacter,
} from "../engine/player/playerSelectionSystem.js";
import { updatePhase3 } from "../phases/phase3_clinic/clinicSystem.js";
import { updatePhase4 } from "../phases/phase4_driving_school1/drivingSchool1.js";
import { updatePhase5 } from "../phases/phase5_theoretical_test/theoreticalTest.js";
import { updatePhase6 } from "../phases/phase6_driving_school2/drivingSchool2.js";
import { updatePhase7 } from "../phases/phase7_practical_test/practicalTest.js";
import { updatePhase8 } from "../phases/phase8_final_scene/finalScene.js";
import { enableDebug, setupDebugToggle } from "../engine/utils/enableDebug.js";
import { IntroSystem } from "../engine/intro/introSystem.js"; // NOVO IMPORT

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.selectedCharacter = null;
    this.playerTexture = null;
    this.intro = new IntroSystem(this);
  }

  init(data) {
    this.selectedCharacter = data?.selectedCharacter;
    this.playerTexture = data?.playerTexture;

    if (this.selectedCharacter) {
      this.intro.showingCover = false;
      this.intro.showingInstructions = false;
    } else {
      this.intro.init(data);
    }
  }

  preload() {
    // === IMAGENS DA INTRO ===
    this.load.image("capa", "./assets/images/capa.png");
    this.load.image("logo", "./assets/images/iris-logo-marca.png");

    // === IMAGENS PARA TELA DE SELEÇÃO ===
    this.load.image(
      "select_player_boy",
      "./assets/images/select_player_boy.png"
    );
    this.load.image(
      "select_player_girl",
      "./assets/images/select_player_girl.png"
    );

    // === SPRITESHEETS PARA O JOGO ===
    this.load.spritesheet("player_girl", "./assets/images/player_girl.png", {
      frameWidth: 197.5,
      frameHeight: 300,
    });

    this.load.spritesheet("player_boy", "./assets/images/player_boy.png", {
      frameWidth: 197.5,
      frameHeight: 300,
    });

    this.load.spritesheet("pc", "./assets/images/pc.png", {
      frameWidth: 352,
      frameHeight: 224,
    });

    this.load.image("doc_rg", "./assets/images/rg.png");
    this.load.image("doc_cpf", "./assets/images/cpf.png");
    this.load.image("doc_comprovante", "./assets/images/comprovante.png");
    this.load.image(
      "doc_comprovante_renda",
      "./assets/images/comprovante_renda.png"
    );
    this.load.image("habilitacao", "./assets/images/habilitacao.png");
    this.load.image("home_bg", "./assets/images/home_bg.png");
    this.load.image("home_bg_2", "./assets/images/home_bg_2.png");

    this.load.image("bg_intro", "./assets/images/intro_bg.png");

    this.load.image("city_bg", "./assets/images/city_bg.png");
    this.load.image("city_bg_2", "./assets/images/city_bg_2.png");
    this.load.image("autoescola", "./assets/images/autoescola.png");
    this.load.image("obstacle_1", "./assets/images/obstaculo_1.png");
    this.load.image("obstacle_2", "./assets/images/obstaculo_2.png");
    this.load.image("obstacle_3", "./assets/images/obstaculo_3.png");

    this.load.image(
      "instrutor_exame_pratico",
      "./assets/images/instrutor_exame_pratico.png"
    );
    this.load.image("clinic_bg", "./assets/images/clinic_bg.png");
    this.load.image("clinic_bg_2", "./assets/images/clinic_bg_2.png");
    this.load.image("clinic", "./assets/images/clinica.png");

    this.load.image("button_up", "./assets/images/button-up.png");
    this.load.image("button_left", "./assets/images/button-left.png");
    this.load.image("button_right", "./assets/images/button-right.png");
    this.load.image("button_action", "./assets/images/button-action.png");

    this.load.image("instructor", "./assets/images/instructor.png");

    this.load.image("driving_bg", "./assets/images/driving_bg.png");
    this.load.image("driving_bg_2", "./assets/images/driving_bg_2.png");

    this.load.image("instructor_2", "./assets/images/instructor_2.png");

    this.load.image("driving_2_bg", "./assets/images/driving_2_bg.png");
    this.load.image("driving_2_bg_2", "./assets/images/driving_2_bg_2.png");

    this.load.image("detran", "./assets/images/detran.png");
    this.load.image(
      "detran_theoretical_bg",
      "./assets/images/detran_theoretical_bg.png"
    );
    this.load.image(
      "detran_theoretical_bg_2",
      "./assets/images/detran_theoretical_bg_2.png"
    );

    this.load.image(
      "detran_practical_bg",
      "./assets/images/detran_practical_bg.png"
    );
    this.load.image(
      "detran_practical_bg_2",
      "./assets/images/detran_practical_bg_2.png"
    );

    this.load.audio("boing", "./assets/sounds/boing.wav");
    this.load.image("final_bg", "./assets/images/final_bg.png");
    this.load.image("final_bg_2", "./assets/images/final_bg_2.png");
    this.load.image("mail", "./assets/images/correio.png");
    this.load.image("car_final", "./assets/images/carro_final.png");
    this.load.image("mother", "./assets/images/mae.png");
    this.load.image("brother", "./assets/images/irmao.png");
    this.load.image("grandpa", "./assets/images/avo.png");

    this.load.audio("driving_car", "./assets/sounds/driving_car.wav");
    this.load.audio("success", "./assets/sounds/success.wav");

    this.load.audio("main_theme", "./assets/sounds/main_theme.mp3");
    this.load.audio("jump", "./assets/sounds/jump.wav");
    this.load.audio("item", "./assets/sounds/item.wav");
    this.load.audio("click", "./assets/sounds/click.wav");
    this.load.audio("fail", "./assets/sounds/fail.wav");
    this.load.audio("goal_complete", "./assets/sounds/goal_complete.wav");

    this.load.image("arrow_keys", "./assets/images/arrow_keys.png");
    this.load.image("wasd_keys", "./assets/images/wasd_keys.png");
    this.load.image("back_arrow_left", "./assets/images/seta-esquerda.png");

    this.load.image("icon_alert", "./assets/images/icon_alert.png");

    this._makeRectTexture("background", 1600, 450, 0x1f2630);
  }

  create() {
    this.keys = this.input.keyboard.addKeys({
      E: Phaser.Input.Keyboard.KeyCodes.E,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
    });

    this.input.keyboard.target = this.game.canvas;
    this.game.canvas.setAttribute("tabindex", "0");
    this.game.canvas.focus();

    if (this.intro.shouldShowIntro()) {
      if (this.intro.showingCover) {
        this.intro.showCoverScreen();
      } else if (this.intro.showingInstructions) {
        this.intro.showInstructionsScreen();
      }
      return;
    }

    if (!this.selectedCharacter) {
      this.setupCharacterSelection((character) => {
        this.startGameWithCharacter(character);
      });
      return;
    }

    this.startMainGame();
  }

  setupCharacterSelection(callback) {
    setupCharacterSelection(this, callback);
  }

  startGameWithCharacter(character) {
    startGameWithCharacter(this, character);
  }

  update() {
    if (this.intro.update()) {
      return;
    }

    if (!this.selectedCharacter) return;

    if (this.playerState && this.playerState.transitioning) return;

    if (
      this.player &&
      this.player.body &&
      this.player.body.touching.down &&
      this.player.body.velocity.y === 0
    ) {
      this.bedBounceStrength = 380;
    }

    try {
      if (this.player) {
        updatePlayerMovement(this);
      }

      if (this.playerState?.currentArea === AREAS.home && this.documents) {
        updateDocuments(this);
      } else if (this.playerState?.currentArea === AREAS.city) {
        this.player.body.setSize(120, 270);
        updatePhase2(this);
      } else if (this.playerState?.currentArea === AREAS.clinic) {
        updatePhase3(this);
      } else if (this.playerState?.currentArea === AREAS.drivingSchool1) {
        updatePhase4(this);
      } else if (this.playerState?.currentArea === AREAS.theoreticalTest) {
        updatePhase5(this);
      } else if (this.playerState?.currentArea === AREAS.drivingSchool2) {
        updatePhase6(this);
      } else if (this.playerState?.currentArea === AREAS.practicalTest) {
        updatePhase7(this);
      } else if (this.playerState?.currentArea === AREAS.finalScene) {
        updatePhase8(this);
      }

      if (this.player) {
        updateGenericInteractions(this);
      }
      checkTransitions(this);
      updateUI(this);
    } catch (err) {
      console.error("Erro no ciclo de update:", err);
    }
  }

  startMainGame() {
    this.music = this.sound.play("main_theme", CONFIG_SONG);

    const { width, height } = this.scale;

    this.add
      .image(WORLD_SIZE / 2, height / 2, "background")
      .setDisplaySize(WORLD_SIZE, height)
      .setDepth(-3);

    this.ground = new Ground(this);

    this.homeBg1 = this.add
      .image(width / 2, height / 2, "home_bg")
      .setDepth(-2)
      .setScale(0.48);

    this.homeBg2 = this.add
      .image(width / 2 + 600, height / 2, "home_bg_2")
      .setDepth(-2)
      .setScale(0.48);

    const pc = new InteractiveObject(this, {
      key: "pc",
      x: width - 235,
      y: height - 160,
      texture: "pc",
      label: "",
      dialogs: [
        "CNH Popular Ceará - Inscrições Abertas!",
        "O programa oferece a 1ª via da Carteira Nacional de Habilitação de forma gratuita para pessoas de baixa renda.",
        "Para se inscrever, você precisa: Ter entre 18 e 65 anos, ser de família de baixa renda e morar no Ceará há pelo menos 2 anos.",
        "O processo tem as etapas de inscrição, entrega de documentos, aulas teóricas e práticas, exame médico e provas teórica e prática.",
        "Primeiro, vamos verificar se você tem todos os documentos necessários: RG, CPF, comprovante de residência e de renda.",
        "Encontre seus documentos para começar o processo!",
      ],
      onInteract: () => {
        if (!this.playerState.docsMissionCompleted) {
          this.playerState.hasMission = true;
          this.ui.showMessage(
            "Encontre RG, CPF e comprovante de residência e de renda na sua casa!"
          );
        }
      },
      hintText: "Pressione a tecla E para interagir",
      hintTexture: "button_action",
      scale: 0.35,
    });

    this.physics.add.collider(pc, this.ground.ground);

    // Player (usa o spritesheet correto baseado na seleção)
    this.player = setupPlayer(this, 60, height - 305, this.playerTexture);

    this.physics.add.collider(this.player, this.ground.ground);

    this.playerState = createPlayerState();
    const _stateRef = getPlayerStateInstance();

    Object.defineProperty(this, "playerState", {
      configurable: false,
      enumerable: true,
      get() {
        return _stateRef;
      },
      set(newVal) {
        if (newVal && typeof newVal === "object") {
          Object.assign(_stateRef, newVal);
        }
      },
    });

    const bedY = this.scale.height - 130;
    this.bed = this.add
      .rectangle(152, bedY, 180, 10, 0x9966ff)
      .setOrigin(0.5, 1)
      .setAlpha(0);

    this.physics.add.existing(this.bed, true);
    this.bed.body.setSize(160, 8);
    this.bed.body.updateFromGameObject();

    this.bed.setDepth(-1);

    this.bedBounceStrength = 380;
    this.bedDamping = 0.75;
    this.minBounce = 120;
    this.lastBounceTime = 0;

    this.physics.add.overlap(
      this.player,
      this.bed,
      this.handleBedBounce,
      undefined,
      this
    );

    this.playerState.currentArea = AREAS.home;
    this.playerState.character = this.selectedCharacter;
    this.playerState.playerTexture = this.playerTexture;

    CameraSystem.initCamera(this, this.player, WORLD_SIZE, height);

    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,

      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,

      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      E: Phaser.Input.Keyboard.KeyCodes.E,
    });

    this.input.keyboard.target = this.game.canvas;
    this.game.canvas.setAttribute("tabindex", "0");
    this.game.canvas.focus();

    this.ui = setupUI(this);
    this.transition = setupTransitions(this);
    this.documents = setupDocuments(this);

    this.time.delayedCall(1000, () => {
      this.ui.showMessage(
        "Aproxime-se do computador e aperte a TECLA E para começar sua jornada!"
      );
    });

    if (PHYSICS_DEBUG) {
      enableDebug(this, { initialOn: true });
      setupDebugToggle(this, "P");
    }
  }

  handleBedBounce() {
    const player = this.player;
    const bed = this.bed;
    const now = this.time.now;

    if (!player.body || !bed.body) return;

    const playerFalling = player.body.velocity.y > 100;
    const touchingTop = player.body.bottom <= bed.body.top + 10;

    if (playerFalling && touchingTop) {
      if (now - this.lastBounceTime < 200) return;
      this.lastBounceTime = now;

      player.setVelocityY(-this.bedBounceStrength);

      this.bedBounceStrength *= this.bedDamping;
      if (this.bedBounceStrength < this.minBounce) {
        this.bedBounceStrength = 0;
      }

      this.sound.play("boing");
    }
  }

  _makeRectTexture(key, w, h, color) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1);
    g.fillRoundedRect(0, 0, w, h, 6);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
