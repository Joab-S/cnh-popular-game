import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';
import InteractiveObject from '../../engine/interaction/InteractiveObject.js';

export function startPhase6(scene) {
  const { width, height } = scene.scale;

  CameraSystem.initCamera(scene, scene.player, WORLD_SIZE, height);
  scene.physics.world.setBounds(0, 0, WORLD_SIZE, height);

  scene.physics.world.setBounds(0, 0, WORLD_SIZE, height);

  scene.add.image((width / 2), height / 2, "driving_2_bg")
    .setDepth(-3)
    .setScale(0.48);

  scene.add.image(width / 2 + 630, height / 2, "driving_2_bg_2")
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

  const isGirl = scene.playerState.character === "girl";
  const pronome = isGirl ? "candidata" : "candidato";

  const instructor = new InteractiveObject(scene, {
    key: 'instructor',
    x: width - 310,
    y: height - 175,
    texture: 'instructor_2',
    scale: 0.24,
    width: 150,
    height: 100,
    proximity: { x: 80, y: 120 }, 
    dialogs: [
      `Olá, ${pronome}! ${bemVindo} às aulas teóricas.`,
      'Aqui você vai aprender a controlar o veículo na prática: embreagem, câmbio, setas e espelhos.',
      'São 20 horas/aula obrigatórias, começando no pátio e evoluindo para o trânsito real.',
      'Você vai praticar: baliza, estacionamento, rampas, mudança de marcha e direção no trânsito.',
      'O instrutor estará ao seu lado para orientar e garantir sua segurança durante todo o processo.',
      'Lembre-se: sempre use cinto de segurança, ajuste os espelhos e verifique os pedais antes de iniciar.',
      'Boa sorte nos estudos!'
  ],
    onInteract: () => {
        if (!scene.playerState.phase6Completed) {
          scene.ui.showMessage(`Pode seguir em frente, campe${isGirl ? "ã" : "ão"}!`);
          scene.playerState.phase6Completed = true;
        }
  },
    label: '',
    hintText: 'Pressione a tecla E para interagir',
  });
    
  instructor.sprite.setDepth(-2);
}

export function updatePhase6(scene) {
  if (scene.playerState.currentArea !== AREAS.drivingSchool2) return;
}