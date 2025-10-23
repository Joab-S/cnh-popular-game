import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';

export function startPhase8(scene) {
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
  scene.playerState.currentArea = AREAS.finalScene;

  scene.playerState = {
    canMove: true,
    inDialog: false,
    currentArea: AREAS.finalScene
  };
}

export function updatePhase8(scene) {
  if (scene.playerState.currentArea !== AREAS.finalScene) return;
}