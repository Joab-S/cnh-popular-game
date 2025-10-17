import * as CameraSystem from '../camera/cameraSystem.js';
import { clearScene } from '../utils/sceneUtils.js';
import Ground from '../physics/Ground.js';
import { setupDocuments } from '../../phases/phase1_home/documentSystem.js';
import { startPhase2 } from '../../phases/phase2_city/SelectionSystem.js';

/**
 * Define o limite de transição padrão (borda direita da casa).
 */
export function setupTransitions(scene) {
  return { sceneEndX: scene.scale.width * 2 - 60 };
}

/**
 * Atualiza transições entre áreas (somente quando permitido).
 * Livre de missão: a transição acontece do mesmo jeito.
 */
export function checkTransitions(scene) {
  const { player, transition, playerState } = scene;
  if (!player || !transition || !playerState) return;
  if (playerState.transitioning || playerState.transitionCooldown) return;

  // sair da casa pela direita → cidade
  if (playerState.currentArea === 'home' && player.x >= transition.sceneEndX) {
    goToArea(scene, 'city');
  }
}

/**
 * Transição genérica para qualquer área do jogo.
 * @param {Phaser.Scene} scene
 * @param {'home'|'city'} area
 * @param {object} options
 */
export function goToArea(scene, area, options = {}) {
  const { delay = 600, preservePlayer = true } = options;
  const state = scene.playerState;

  if (state.transitioning || state.transitionCooldown) return;

  state.transitioning = true;
  state.canMove = false;

  // faz fade-out -> limpa -> carrega nova área -> fade-in
  CameraSystem.transition(scene, () => {
    clearScene(
      scene,
      preservePlayer
        ? [scene.player, scene.ui?.inventory, scene.ui?.messageBox]
        : []
    );

    // pequena pausa para garantir que o fade-out terminou
    scene.time.delayedCall(delay, () => {
      // === escolhe a nova área ===
      if (area === "home") {
        loadHome(scene);
      } else if (area === "city") {
        if (!state.docsMissionCompleted) {
          loadCityFree(scene); // cidade livre
        } else {
          startPhase2(scene); // corrida
        }
      } else {
        console.warn(`Área desconhecida: ${area}`);
      }

      // === atualiza estado global ===
      state.currentArea = area;
      state.transitioning = false;
      state.transitionCooldown = true;
      state.canMove = true;

      // === cooldown pra evitar loop de entradas rápidas ===
      scene.time.delayedCall(1000, () => {
        state.transitionCooldown = false;
      });
    });
  });
}



/** Carrega a casa (fase 1 base) */
function loadHome(scene) {
  const { width, height } = scene.scale;

  // fundo/cenário
  scene.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height).setDepth(-1);
  scene.ground = new Ground(scene);

  // PC
  scene.pc = scene.physics.add.staticSprite(width - 320, height - 100, "pc").setScale(0.3);
  scene.physics.add.collider(scene.pc, scene.ground.ground);

  // Player
  scene.player.setPosition(60, height - 150);
  scene.physics.add.collider(scene.player, scene.ground.ground);

  // Câmera/mundo
  CameraSystem.initCamera(scene, scene.player, width * 2, height);

  // Documentos (mantém estado)
  scene.documents = setupDocuments(scene);

  scene.ui.showMessage('Você está em casa.');
}

/** Cidade livre (sem corrida) */
function loadCityFree(scene) {
  const { width, height } = scene.scale;

  // cenário simples da cidade
  CameraSystem.initCamera(scene, scene.player, width * 2, height);
  scene.physics.world.setBounds(0, 0, width * 2, height);

  // céu + chão
  scene.add.rectangle(width, height / 2, width * 2, height, 0x87ceeb).setDepth(-5);
  const groundRect = scene.add.rectangle(width, height - 30, width * 2, 60, 0x444444);
  scene.physics.add.existing(groundRect, true);
  scene.physics.add.collider(scene.player, groundRect);
  scene.ground = { ground: groundRect };

  // player
  scene.player.setPosition(60, height - 150);
  scene.player.setVelocity(0);
  scene.player.setVisible(true);
  scene.player.setActive(true);
  scene.player.body.enable = true;
  
  // HUD
  scene.ui.showMessage('Explore livremente a cidade!');
  scene.playerState.currentArea = 'city';

  // === PORTA DE VOLTA (sempre presente) ===
  const homeZone = scene.add.rectangle(40, height - 90, 60, 120, 0x333333, 0.25);
  scene.physics.add.existing(homeZone, true);
  scene.homeZone = homeZone;

  scene.physics.add.overlap(scene.player, homeZone, () => {
    const state = scene.playerState;
    if (state.transitioning || state.transitionCooldown) return;
    scene.ui.showMessage('Voltando para casa...');
    scene.time.delayedCall(400, () => returnToHome(scene));
  });
}

/**
 * Retorna o jogador para a casa (fase 1).
 * Usa goToArea('home') diretamente, mas garante que funcione
 * mesmo se transition estiver ativa.
 */
export function returnToHome(scene) {
  const { playerState } = scene;

  // 🔹 se já está em transição, mas é pra voltar pra casa, força o fluxo
  if (playerState.transitioning && playerState.currentArea !== 'home') {
    // cancela flags antigas e reabilita movimento temporariamente
    playerState.transitioning = false;
    playerState.transitionCooldown = false;
    playerState.canMove = true;
  }

  // chama a função genérica normalmente
  goToArea(scene, 'home', { delay: 400 });
}