import Ground from "../engine/physics/Ground.js";
import * as CameraSystem from "../engine/camera/cameraSystem.js";
import { createPlayerState } from "../engine/player/playerState.js";
import { setupPlayer, updatePlayerMovement } from "../engine/player/playerController.js";
import { setupUI, updateUI } from "../engine/ui/uiSystem.js";
import { setupTransitions, checkTransitions } from "../engine/transition/transitionSystem.js";
import { setupDocuments, updateDocuments } from "../phases/phase1_home/documentSystem.js";
import { updatePhase2 } from "../phases/phase2_city/SelectionSystem.js";
import InteractiveObject from "../engine/interaction/InteractiveObject.js";
import { updateGenericInteractions } from '../engine/interaction/interactionSystem.js';
import { AREAS, WORLD_SIZE } from "./config.js";

/**
 * CENA PRINCIPAL DO JOGO
 * Responsável por orquestrar os sistemas, fases e câmera.
 * Não contém lógicas específicas de fases.
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // === SPRITES ===
    this.load.spritesheet("player", "./assets/images/player.png", {
      frameWidth: 197.5,
      frameHeight: 300,
    });

    this.load.spritesheet("pc", "./assets/images/pc.png", {
      frameWidth: 352,
      frameHeight: 224,
    });

    // === ITENS ===
    this.load.image("doc_rg", "./assets/images/rg.png");
    this.load.image("doc_cpf", "./assets/images/cpf.png");

    // === TEXTURAS DO MAPA ===
    this._makeRectTexture("background", 1600, 450, 0x1f2630);
  }

  create() {
    const { width, height } = this.scale;

    // Fundo
    this.add
      .image(WORLD_SIZE / 2, height / 2, 'background')
      .setDisplaySize(WORLD_SIZE, height)
      .setDepth(-1);
    this.ground = new Ground(this);

    // PC
    new InteractiveObject(this, {
      key: 'pc',
      x: width - 320,
      y: height - 100,
      texture: 'pc',
      label: "Computador",
      dialogs: [
        '“CNH Popular Ceará” — inscrições abertas!',
        'Clique para saber como participar.'
      ],
      onInteract: () => {
        if (!this.playerState.docsMissionCompleted) {
          this.playerState.hasMission = true;
          this.ui.showMessage('Missão: encontre seus documentos!');
        } else {
          this.ui.showMessage('Você já concluiu esta etapa!');
        }
      }
    });

    this.pc.setScale(0.3);
    this.physics.add.collider(this.pc, this.ground.ground);

    // Player
    this.player = setupPlayer(this, 60, height - 105);

    // Estado global do jogador
    this.playerState = createPlayerState();
    this.playerState.currentArea = AREAS.home;

    // Câmera e mundo
    CameraSystem.initCamera(this, this.player, WORLD_SIZE, height);

    // Controles globais
    this.keys = this.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      E: Phaser.Input.Keyboard.KeyCodes.E,
    });

    this.input.keyboard.target = this.game.canvas;
    this.game.canvas.setAttribute("tabindex", "0");
    this.game.canvas.focus();

    // Sistemas
    this.ui = setupUI(this);
    this.transition = setupTransitions(this);
    this.documents = setupDocuments(this);
  }

  update() {
    if (this.playerState.transitioning) return;
    
    try {
      updatePlayerMovement(this);
      if (this.playerState?.currentArea === AREAS.home && this.documents) {
        updateDocuments(this);
      }
      if (this.playerState?.currentArea === AREAS.city) {
        updatePhase2(this);
      }
      updateGenericInteractions(this);
      checkTransitions(this);
      updateUI(this);
    } catch (err) {
      console.error("Erro no clico de update:", err);
    }
  }
  
  // Utils locais
  _makeRectTexture(key, w, h, color) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1);
    g.fillRoundedRect(0, 0, w, h, 6);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}