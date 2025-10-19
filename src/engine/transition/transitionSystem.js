import * as CameraSystem from '../camera/cameraSystem.js';
import { clearScene } from '../utils/sceneUtils.js';
import { startPhase2 } from '../../phases/phase2_city/SelectionSystem.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';

/**
 * Define o limite de transição padrão (borda direita da casa).
 */
export function setupTransitions(scene) {
  return { sceneEndX: WORLD_SIZE * 0.95 };
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
  if (playerState.currentArea === AREAS.home && player.x >= transition.sceneEndX) {
    if (playerState.docsMissionCompleted) {
      goToArea(scene, AREAS.city);
    }
  }
  if (playerState.currentArea === AREAS.city && player.x >= transition.sceneEndX) {
    if (playerState.phase2Completed) {
      goToArea(scene, 'driving-school');
    }
  } 
}

/**
 * Transição genérica para qualquer área do jogo.
 * @param {Phaser.Scene} scene
 * @param {'home'|'city'} area
 * @param {object} options
 */
export function goToArea(scene, area, options = {}) {
  const { delay = 0, preservePlayer = true } = options;
  const state = scene.playerState;

  if (state.transitioning || state.transitionCooldown) return;

  state.transitioning = true;
  state.canMove = false;

  // faz fade-out -> limpa -> carrega nova área -> fade-in
  CameraSystem.transition(scene, () => {
    clearScene(
      scene,
      preservePlayer
        ? [scene.player, scene.playerState, scene.ui?.inventory, scene.ui?.messageBox]
        : []
    );

    // pequena pausa para garantir que o fade-out terminou
    scene.time.delayedCall(delay, () => {
      // === escolhe a nova área ===
      if (area === AREAS.home) {
        loadHome(scene);
      } else if (area === AREAS.city) {
        startPhase2(scene);
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