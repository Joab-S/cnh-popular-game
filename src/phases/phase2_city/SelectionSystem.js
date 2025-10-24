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

  // clearScene(scene, [scene.player, scene.playerState, scene.ground, scene.ui?.inventory, scene.ui?.messageBox]);
  // scene.time.removeAllEvents();

  // === MUNDO VISUAL ===
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
  scene.playerState.currentArea = AREAS.city;

  scene.playerState = {
    canMove: true,
    inDialog: false,
    currentArea: AREAS.city
  };

  // === INTERFACE ===
  scene.ui.showMessage('Missão: Encontre o tio do DETRAN!');

  // === OBSTÁCULOS ===
  scene.obstacles = setupObstacles(scene);
  scene.physics.add.collider(scene.obstacles, groundRect);
  scene.physics.add.collider(scene.player, scene.obstacles, () => {
    scene.player.setVelocityY(-250);
  });

  // === NPC DO DETRAN ===
  new InteractiveObject(scene, {
    key: 'npc_detran',
    x: width ,
    y: height - 120,
    width: 60,
    height: 120,
    color: 0x5dadec,
    dialogs:[
      'Olá! Parabéns por chegar até aqui.',
      'Antes de confirmar sua inscrição, preciso fazer algumas perguntas sobre o programa CNH Popular.'
    ],
    onInteract: () => {
      if (scene.playerState.quizActive) return;
      if (!scene.playerState.phase2Completed && !scene.playerState.hasMission) {
        startQuiz(scene);
      }
    },
    label: 'Agente DETRAN'
  });
}

/**
 * Atualização da fase 2 — chamada no GameScene.update()
 */
export function updatePhase2(scene) {
  if (scene.playerState.currentArea !== AREAS.city) return;
  updateObstacles(scene);
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
    
    const npcObject = scene.interactiveObjects.find(o => o.key === 'npc_detran');
    const dialog = 'Dirija-se à Autoescola para iniciar a próxima fase.';
    npcObject.dialogs = [
      dialog
    ];

    // libera o movimento novamente
    scene.time.delayedCall(500, () => {
      scene.ui.showMessage(dialog);
      scene.playerState.canMove = true;
      scene.playerState.inDialog = false;
      scene.playerState.quizActive = false;
    });
  }

  showQuestion();
}
