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

import { setupCharacterSelection, startGameWithCharacter } from "../engine/player/playerSelectionSystem.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.selectedCharacter = null;
  }

  init(data) {
    // Recebe o personagem selecionado, se houver
    this.selectedCharacter = data?.selectedCharacter;
    this.playerTexture = data?.playerTexture;
  }

  preload() {
    // === IMAGENS PARA TELA DE SELEÇÃO ===
    this.load.image("select_player_boy", "./assets/images/select_player_boy.png");
    this.load.image("select_player_girl", "./assets/images/select_player_girl.png");

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
    this.load.image("home_bg", "./assets/images/home_bg.png");
    this.load.image("home_bg_2", "./assets/images/home_bg_2.png");

    this.load.image("bg_intro", "./assets/images/bg_intro.png");

    this._makeRectTexture("background", 1600, 450, 0x1f2630);
  }

  create() {
    // === VERIFICA SE PRECISA MOSTRAR SELEÇÃO DE PERSONAGEM ===
    if (!this.selectedCharacter) {
      setupCharacterSelection(this, (character) => {
        startGameWithCharacter(this, character);
      });
      return;
    }

    // === CONTINUA COM O JOGO NORMAL (personagem já selecionado) ===
    const { width, height } = this.scale;

    this.add
      .image(WORLD_SIZE / 2, height / 2, 'background')
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
      key: 'pc',
      x: width - 235,
      y: height - 160,
      texture: 'pc',
      label: "",
      dialogs: [
        'CNH Popular Ceará - Inscrições Abertas!',
        'O programa oferece a 1ª via da Carteira Nacional de Habilitação de forma gratuita para pessoas de baixa renda.',
        'Para se inscrever, você precisa: Ter entre 18 e 65 anos, ser de família de baixa renda e morar no Ceará há pelo menos 2 anos.',
        'O processo tem as etapas de inscrição, entrega de documentos, aulas teóricas e práticas, exame médico e provas teórica e prática.',
        'Primeiro, vamos verificar se você tem todos os documentos necessários: RG, CPF e comprovante de residência.',
        'Encontre seus documentos para começar o processo!'
      ],
      onInteract: () => {
        const pcObject = this.interactiveObjects.find(o => o.key === 'pc');

        if (this.playerState.docsMissionCompleted) {
          pcObject.dialogs = [
            'Você foi inscrito na CNH Popular! Agora, vamos em frente para a próxima etapa!'
          ];
        } else {
          this.playerState.hasMission = true;
          this.ui.showMessage('Missão: Encontre RG, CPF e comprovante na sua casa!');
        }
      },
      hintText: 'Clique E para ver informações sobre a CNH Popular'
    });

    this.pc.setScale(0.35);
    this.physics.add.collider(pc, this.ground.ground);

    // Player (usa o spritesheet correto baseado na seleção)
    this.player = setupPlayer(this, 60, height - 305, this.playerTexture);

    this.physics.add.collider(this.player, this.ground.ground);

    this.playerState = createPlayerState();
    this.playerState.currentArea = AREAS.home;
    this.playerState.character = this.selectedCharacter;
    this.playerState.playerTexture = this.playerTexture;

    CameraSystem.initCamera(this, this.player, WORLD_SIZE, height);

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

    this.ui = setupUI(this);
    this.transition = setupTransitions(this);
    this.documents = setupDocuments(this);

    this.time.delayedCall(1000, () => {
      this.ui.showMessage('Aproxime-se do computador e aperte a TECLA E para começar sua jornada!');
    });
  }

  update() {
    if (!this.selectedCharacter) return;
    
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
  
  _makeRectTexture(key, w, h, color) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1);
    g.fillRoundedRect(0, 0, w, h, 6);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}