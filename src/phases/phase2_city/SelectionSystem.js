import { setupObstacles, updateObstacles } from '../../engine/physics/obstacleSystem.js';
import { clearScene } from '../../engine/utils/sceneUtils.js';
import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { updateGenericInteractions } from '../../engine/interaction/interactionSystem.js';
import InteractiveObject from '../../engine/interaction/InteractiveObject.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';

/**
 * FASE 2 — Corrida até o DETRAN + Interação com NPC
 */
export function startPhase2(scene) {
  const { width, height } = scene.scale;

  if (scene.interactiveObjects) {

    scene.interactiveObjects = scene.interactiveObjects.filter(obj => 
      obj.key !== 'pc'
    );
    
    if (scene.pc) {
      scene.pc.destroy();
      scene.pc = null;
    }
  }

  // === MUNDO VISUAL ===
  CameraSystem.initCamera(scene, scene.player, WORLD_SIZE, height);
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
  scene.playerState.currentArea = AREAS.city;

  scene.playerState = {
    canMove: true,
    inDialog: false,
    currentArea: AREAS.city
  };

  // === INTERFACE ===
  scene.ui.showMessage('Missão: Encontre a AUTOESCOLA e pressione E para interagir!');

  // === OBSTÁCULOS ===
  scene.obstacles = setupObstacles(scene);
  
  let collisionDebugged = false;

  scene.physics.add.collider(scene.player, scene.obstacles, () => {
    if (!collisionDebugged) {
      collisionDebugged = true;
    }
  });

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
        'Olá! Parabéns por chegar até aqui.',
        'Antes de confirmar sua inscrição, preciso fazer algumas perguntas sobre o programa CNH Popular.'
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

  autoescola.sprite.setDepth(-2);
}

/**
 * Atualização da fase 2 — chamada no GameScene.update()
 */
export function updatePhase2(scene) {
  if (scene.playerState.currentArea !== AREAS.city) return;

  updateGenericInteractions(scene);
}

function startQuiz(scene) {
  const { width, height } = scene.scale;
  
  scene.playerState.quizActive = true;
  scene.playerState.hasMission = true;

  // pausa o movimento
  scene.playerState.canMove = false;
  scene.playerState.inDialog = true;

  const quiz = [
    {
      text: 'Quem pode participar do programa CNH Popular?',
      options: ['A) Qualquer pessoa', 'B) Pessoas inscritas no CadÚnico'],
      correct: 1,
      explanation: 'Somente quem está no CadÚnico pode participar.'
    },
    {
      text: 'Quais documentos são obrigatórios para a inscrição?',
      options: ['A) RG e CPF', 'B) Certidão de nascimento'],
      correct: 0,
      explanation: 'É necessário RG e CPF válidos.'
    },
    {
      text: 'Onde são divulgados os resultados da seleção?',
      options: ['A) No site do DETRAN', 'B) Na prefeitura'],
      correct: 0,
      explanation: 'Os resultados são divulgados no site oficial do DETRAN.'
    }
  ];

  let current = 0;
  let correctCount = 0;

  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setScrollFactor(0);
  const question = scene.add.text(width / 2, height / 2 - 80, '', {
    fontSize: '16px',
    color: '#fff',
    align: 'center',
    wordWrap: { width: width - 80 }
  }).setOrigin(0.5).setScrollFactor(0);

  const buttons = [];

  function showQuestion() {
    const q = quiz[current];
    question.setText(q.text);
    buttons.forEach(b => b.destroy());
    buttons.length = 0;

    q.options.forEach((opt, i) => {
      const btn = scene.add.text(width / 2, height / 2 + i * 40, opt, {
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5).setInteractive().setScrollFactor(0);

      btn.on('pointerdown', () => {
        if (i === q.correct) {
          scene.ui.showMessage('Correto!');
          correctCount++;
        } else {
          scene.ui.showMessage(`Errado. ${q.explanation}`);
        }

        current++;
        if (current < quiz.length) showQuestion();
        else finishQuiz();
      });

      buttons.push(btn);
    });
  }

  function finishQuiz() {
    buttons.forEach(b => b.destroy());
    overlay.destroy();
    question.destroy();

    scene.ui.showMessage(
      correctCount === quiz.length
        ? 'Você acertou todas! Parabéns!'
        : 'Você concluiu o quiz!'
    );

    scene.playerState.phase2Completed = true;
    scene.playerState.hasMission = true;
    
    // libera o movimento novamente
    scene.time.delayedCall(500, () => {
      scene.ui.showMessage('Dirija-se à Autoescola para iniciar a próxima fase.');
      scene.playerState.canMove = true;
      scene.playerState.inDialog = false;
      scene.playerState.quizActive = false;
    });
  }

  showQuestion();
}
