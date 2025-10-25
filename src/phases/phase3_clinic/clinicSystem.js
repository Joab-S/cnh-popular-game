import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';
import InteractiveObject from '../../engine/interaction/InteractiveObject.js';

export function startPhase3(scene) {
  const { width, height } = scene.scale;

  CameraSystem.initCamera(scene, scene.player, WORLD_SIZE, height);
  scene.physics.world.setBounds(0, 0, WORLD_SIZE, height);

  scene.add.image((width / 2), height / 2, "clinic_bg")
    .setDepth(-3)
    .setScale(0.48);

  scene.add.image(width / 2 + 590, height / 2, "clinic_bg_2")
    .setDepth(-3)
    .setScale(0.48);

  const groundRect = scene.add.rectangle(WORLD_SIZE / 2, height - 30, WORLD_SIZE, 64, 0x444444);
  groundRect.setVisible(false);

  scene.physics.add.existing(groundRect, true);
  scene.physics.add.collider(scene.player, groundRect);
  scene.ground = { ground: groundRect };

    // === CLÍNICA ===
    const clinic = new InteractiveObject(scene, {
        key: 'clinic',
        x: width + 157,
        y: height - 228,
        texture: 'clinic',
        scale: 0.8,
        width: 200,
        height: 100,
        proximity: { x: 80, y: 120 }, 
        dialogs: [
            'Olá, seja bem-vindo à clínica credenciada.',
            'Vou realizar o exame psicotécnico, que avalia suas condições psicológicas para dirigir.',
            'É um teste rápido que verifica atenção, memória e habilidades necessárias para a CNH.',
            'Vamos dar início ao exame agora.'
        ],
        onInteract: () => {
            if (scene.playerState.quizActive) return;
            if (!scene.playerState.phase2Completed && !scene.playerState.hasMission) {
                startQuiz(scene);
            } else {
              scene.interactiveObjects.find(o => o.key === 'npc_detran').dialogs = [
                  'Dirija-se à Autoescola para iniciar a próxima fase.'
              ];
            }
        },
        label: '',
        hintText: '',
    });
  
    clinic.sprite.setDepth(-2);

  // === PLAYER ===
  scene.player.setPosition(30, height - 305);
  scene.player.setVelocity(0);
  scene.playerState.canMove = true;
  scene.playerState.currentArea = AREAS.clinic;

  scene.playerState = {
    canMove: true,
    inDialog: false,
    currentArea: AREAS.clinic
  };
}

export function updatePhase3(scene) {
  if (scene.playerState.currentArea !== AREAS.clinic) return;
}