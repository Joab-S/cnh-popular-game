import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';
import InteractiveObject from '../../engine/interaction/InteractiveObject.js';

export function startPhase6(scene) {
  const { width, height } = scene.scale;

  CameraSystem.initCamera(scene, scene.player, WORLD_SIZE, height);
  scene.physics.world.setBounds(0, 0, WORLD_SIZE, height);

  scene.physics.world.setBounds(0, 0, WORLD_SIZE, height);

  scene.add.image((width / 2), height / 2, "city_bg")
    .setDepth(-3)
    .setScale(0.48);

  scene.add.image(width / 2 + 620, height / 2, "city_bg_2")
    .setDepth(-3)
    .setScale(0.48);
    
  const groundRect = scene.add.rectangle(WORLD_SIZE / 2, height - 30, WORLD_SIZE, 64, 0x444444);
  groundRect.setVisible(false);

  scene.physics.add.existing(groundRect, true);
  scene.physics.add.collider(scene.player, groundRect);
  scene.ground = { ground: groundRect };

  // === PLAYER ===
  scene.player.setPosition(30, height - 305);
  scene.player.setVelocity(0);
  scene.playerState.canMove = true;
  scene.playerState.currentArea = AREAS.drivingSchool2;

  scene.playerState = {
    canMove: true,
    inDialog: false,
    currentArea: AREAS.drivingSchool2
  };

    // === AUTOESCOLA ===
      const autoescola = new InteractiveObject(scene, {
        key: 'autoescola',
        x: width + 160,
        y: height - 190,
        texture: 'autoescola',
        scale: 0.60,
        width: 200,
        height: 100,
        proximity: { x: 80, y: 120 }, 
        dialogs: [
          'Olá! Agora você terá suas aulas práticas.',
          'Aprendeu? Por hoje é só, pessoal!'
        ],
        onInteract: () => {
            if (!scene.playerState.phase6Completed) {
              console.log('Iniciando aulas práticas...');
              scene.ui.showMessage('Pode seguir em frente, campeão!');
              scene.playerState.phase6Completed = true;
            }
      },
        label: '',
        hintText: '',
      });
  
    autoescola.sprite.setDepth(-2);
}

export function updatePhase6(scene) {
  if (scene.playerState.currentArea !== AREAS.drivingSchool2) return;
}