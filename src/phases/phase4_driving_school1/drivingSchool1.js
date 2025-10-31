import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';
import InteractiveObject from '../../engine/interaction/InteractiveObject.js';

export function startPhase4(scene) {
  const { width, height } = scene.scale;

  CameraSystem.initCamera(scene, scene.player, WORLD_SIZE, height);
  scene.physics.world.setBounds(0, 0, WORLD_SIZE, height);

  scene.add.image((width / 2), height / 2, "driving_bg")
    .setDepth(-3)
    .setScale(0.48);

  scene.add.image((width / 2 + 600), height / 2, "driving_bg_2")
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
  scene.playerState.currentArea = AREAS.drivingSchool1;

  scene.playerState = {
    canMove: true,
    inDialog: false,
    currentArea: AREAS.drivingSchool1
  };

  const instructor = new InteractiveObject(scene, {
    key: 'instructor',
    x: width - 310,
    y: height - 132,
    texture: 'instructor',
    scale: 0.25,
    width: 100,
    height: 100,
    proximity: { x: 80, y: 120 }, 
    dialogs: [
      'Olá, futuro(a) motorista! Bem-vindo às aulas teóricas.',
      'Aqui você vai aprender as regras de trânsito, sinalização, direção defensiva e primeiros socorros.',
      'São 45 horas/aula obrigatórias, divididas em conteúdo legislativo e prático.',
      'Ao final, fará uma prova teórica no DETRAN. Precisa acertar pelo menos 70% para ser aprovado(a).',
      'Preste atenção nas aulas e faça os simulados. Isso vai te ajudar muito!',
      'Boa sorte nos estudos!'
    ],
    onInteract: () => {
        if (!scene.playerState.phase4Completed) {
          console.log('Iniciando aulas teóricas...');
          scene.ui.showMessage('Pode seguir em frente, campeã(o)!');
          scene.playerState.phase4Completed = true;
        }
  },
    label: '',
    hintText: 'Pressione a tecla E para interagir',
  });
    
  instructor.sprite.setDepth(-2);
}

export function updatePhase4(scene) {
  if (scene.playerState.currentArea !== AREAS.drivingSchool1) return;
}