import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';
import InteractiveObject from '../../engine/interaction/InteractiveObject.js';
import { updateGenericInteractions } from '../../engine/interaction/interactionSystem.js';
import TrafficSignsGameScene from '../../core/TrafficSignsGameScene.js';

export function startPhase5(scene) {
  const { width, height } = scene.scale;

  CameraSystem.initCamera(scene, scene.player, WORLD_SIZE, height);
  scene.physics.world.setBounds(0, 0, WORLD_SIZE, height);

  scene.add.rectangle(WORLD_SIZE / 2, height / 2, WORLD_SIZE, height, 0x87ceeb).setDepth(-5);
  const groundRect = scene.add.rectangle(WORLD_SIZE / 2, height - 30, WORLD_SIZE, 64, 0x444444);
  scene.physics.add.existing(groundRect, true);
  scene.physics.add.collider(scene.player, groundRect);
  scene.ground = { ground: groundRect };

  // === PLAYER ===
  scene.player.setPosition(30, height - 105);
  scene.player.setVelocity(0);
  scene.playerState.canMove = true;
  scene.playerState.currentArea = AREAS.theoreticalTest;

  scene.playerState = {
    canMove: true,
    inDialog: false,
    currentArea: AREAS.theoreticalTest,
    miniGameActive: false,
    phase5Completed: false
  };

  scene.miniGameKey = 'TrafficSignsGameScene';

  scene.ui.showMessage('Procure a tia da autoescola, ela irá aplicar seu exame teórico.');

  new InteractiveObject(scene, {
    key: 'aplicador_do_exame',
    x: width * 0.8,
    y: height - 120,
    width: 60,
    height: 120,
    label: 'Aplicador do Exame',
    dialogs: [
      'Olá, vamos começar seu exame teórico.',
      'Concentre-se nas placas e reaja rapidamente!'
    ],
    onInteract: () => {
      if (scene.playerState.miniGameActive) return;
      if (!scene.playerState.phase5Completed) {
        startMiniGame(scene);
      }
    },
  });
}

export function updatePhase5(scene) {
  if (scene.playerState.currentArea !== AREAS.theoreticalTest) return;
  updateGenericInteractions(scene);

  const miniGame = scene.scene.get(scene.miniGameKey);

  if (miniGame && scene.playerState.miniGameActive && !scene.playerState.phase5Completed) {
    miniGame.events.once('gameEnded', (data) => {
      closeMiniGame(scene, scene.overlay, scene.miniGameContainer, scene.miniGameKey, data);
    });
  }
}

function startMiniGame(scene) {
  const { width, height } = scene.scale;

    // impede movimento do jogador
    scene.playerState.canMove = false;
    scene.playerState.inDialog = true;
    scene.playerState.miniGameActive = true;

  scene.overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
    .setScrollFactor(0)
    .setDepth(1000);

  scene.miniGameContainer = scene.add.container(width / 2, height / 2).setDepth(1001);

  // Adiciona o minigame como uma cena flutuante
  if (!scene.scene.get(scene.miniGameKey)) {
    scene.scene.add(scene.miniGameKey, TrafficSignsGameScene, false);
  }

  // inicia o minigame
  scene.scene.launch(scene.miniGameKey);

  scene.time.delayedCall(100, () => {
    const miniGame = scene.scene.get(scene.miniGameKey);

    if (!miniGame || !miniGame.cameras?.main) return;

    miniGame.cameras.main.setBackgroundColor('#ffffff');
    miniGame.scale.resize(width * 1, height * 1);

  });
}

function closeMiniGame(scene, overlay, miniGameContainer, miniGameKey, result) {
  if (overlay && overlay.destroy) overlay.destroy();
  if (miniGameContainer && miniGameContainer.destroy) miniGameContainer.destroy();

  // encerra o minigame
  const miniGame = scene.scene.get(miniGameKey);
  if (miniGame) {
    miniGame.scene.stop();
    scene.scene.remove(miniGameKey);
  }

  // restaura controle do jogador
  scene.playerState.miniGameActive = false;
  scene.playerState.canMove = true;
  scene.playerState.inDialog = false;
  scene.playerState.phase5Completed = true;

  const theoreticalObject = scene.interactiveObjects.find(o => o.key === 'aplicador_do_exame');
  const dialog = 'Você foi aprovado, siga para as aulas práticas.';
  theoreticalObject.dialogs = [
    dialog
  ];

  // mensagem final
  const msg = result?.victory
    ? `Excelente! Você completou o exame com ${result.score} pontos!`
    : 'Você terminou o exame.';
  scene.ui.showMessage(msg);
}