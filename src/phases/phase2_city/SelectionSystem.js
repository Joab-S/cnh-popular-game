import { setupObstacles, updateObstacles } from '../../engine/physics/obstacleSystem.js';
import { clearScene } from '../../engine/utils/sceneUtils.js';
import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { returnToHome } from '../../engine/transition/transitionSystem.js';
import { updateGenericInteractions } from '../../engine/interaction/interactionSystem.js';
import InteractiveObject from '../../engine/interaction/InteractiveObject.js';

/**
 * FASE 2 — Corrida até o DETRAN + Interação com NPC
 */
export function startPhase2(scene) {
  const { width, height } = scene.scale;

  clearScene(scene, [scene.player, scene.ui?.inventory, scene.ui?.messageBox]);
  scene.time.removeAllEvents();

  // === MUNDO VISUAL ===
  CameraSystem.initCamera(scene, scene.player, width * 2, height);
  scene.physics.world.setBounds(0, 0, width * 2, height);

  scene.add.rectangle(width, height / 2, width * 2, height, 0x87ceeb).setDepth(-5);
  const groundRect = scene.add.rectangle(width, height - 30, width * 2, 60, 0x444444);
  scene.physics.add.existing(groundRect, true);
  scene.physics.add.collider(scene.player, groundRect);
  scene.ground = { ground: groundRect };

  // === PLAYER ===
  scene.player.setPosition(120, height - 150);
  scene.player.setVelocity(0);
  scene.playerState.canMove = true;
  scene.playerState.currentArea = 'city_race';

  scene.playerState = {
    canMove: true,
    inDialog: false,
    currentArea: 'city_race'
  };

  // === INTERFACE ===
  scene.ui.showMessage('Missão: Chegue ao DETRAN antes do tempo acabar!');

  // === CRONÔMETRO ===
  scene.phase2 = {
    timeLeft: 30,
    running: true,
    timerText: scene.add.text(width - 120, 20, 'Tempo: 30', {
      fontSize: '18px',
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 6, y: 4 }
    }).setScrollFactor(0).setDepth(10)
  };

  scene.phase2.timerEvent = scene.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      if (!scene.phase2?.running) return;
      scene.phase2.timeLeft--;
      scene.phase2.timerText.setText(`Tempo: ${scene.phase2.timeLeft}`);
      if (scene.phase2.timeLeft <= 0) failPhase(scene);
    }
  });

  // === OBSTÁCULOS ===
  scene.obstacles = setupObstacles(scene);
  scene.physics.add.collider(scene.obstacles, groundRect);
  scene.physics.add.collider(scene.player, scene.obstacles, () => {
    scene.player.setVelocityY(-250);
  });

  // === NPC DO DETRAN ===
  const dialogMission = [
    'Olá! Parabéns por chegar até aqui.',
    'Antes de confirmar sua inscrição, preciso fazer algumas perguntas sobre o programa CNH Popular.'
  ];

  // Cria NPC usando o novo sistema unificado
  new InteractiveObject(scene, {
    key: 'npc_detran',
    x: width * 2 - 200,
    y: height - 120,
    width: 60,
    height: 120,
    color: 0x5dadec,
    dialogs: dialogMission,
    onInteract: () => startQuiz(scene), // chamado após terminar o diálogo
    label: 'Agente DETRAN'
  });

  // === PORTA DE VOLTA ===
  const homeZone = scene.add.rectangle(10, height - 90, 60, 120, 0x333333, 0.25);
  scene.physics.add.existing(homeZone, true);
  scene.homeZone = homeZone;

  scene.physics.add.overlap(scene.player, homeZone, () => {
    if (scene.playerState.transitioning || scene.playerState.transitionCooldown) return;
    scene.ui.showMessage('Voltando para casa...');
    scene.playerState.transitioning = true;
    scene.time.delayedCall(600, () => returnToHome(scene));
  });
}

/**
 * Atualização da fase 2 — chamada no GameScene.update()
 */
export function updatePhase2(scene) {
  if (scene.playerState.currentArea !== 'city_race') return;
  updateObstacles(scene);
  updateGenericInteractions(scene);
}

/**
 * Final do cronômetro
 */
function failPhase(scene) {
  scene.phase2.running = false;
  scene.playerState.canMove = false;
  scene.ui.showMessage('Tempo esgotado! Tente novamente.');
  scene.time.removeAllEvents();
  scene.time.delayedCall(1000, () => {
    if (scene.phase2?.timerText) scene.phase2.timerText.destroy();
    startPhase2(scene);
  });
}

/**
 * Quiz do NPC
 */
function startQuiz(scene) {
  const { width, height } = scene.scale;

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

  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
  const question = scene.add.text(width / 2, height / 2 - 80, '', {
    fontSize: '16px',
    color: '#fff',
    align: 'center',
    wordWrap: { width: width - 80 }
  }).setOrigin(0.5);

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
      }).setOrigin(0.5).setInteractive();

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

    // libera o movimento novamente
    scene.time.delayedCall(1500, () => {
      scene.ui.showMessage('Dirija-se à Autoescola para iniciar a próxima fase.');
      scene.playerState.canMove = true;
      scene.playerState.inDialog = false;
    });
  }

  showQuestion();
}
