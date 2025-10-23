/**
 * ======================================================
 *  FASE 1 — CASA DO PERSONAGEM (Coleta de Documentos)
 * ======================================================
 *
 * Objetivo:
 *   - O jogador deve encontrar RG e CPF escondidos.
 *   - Só aparecem após a missão iniciar.
 *   - Cada documento mostra uma explicação quando coletado.
 *   - Quando todos forem coletados → missão concluída.
 *
 * Dependências:
 *   - scene.playerState (com flags hasMission, collectedDocs, etc.)
 *   - scene.ui (com showMessage e addToInventory)
 *   - scene.ground.ground (para colisão)
 */

export function setupDocuments(scene) {
  // grupo vazio inicialmente (sem corpos)
  if (scene.playerState.docsMissionCompleted) return;

  const group = scene.physics.add.group( { allowGravity: true });
  group.runChildUpdate = true;

  // informações estáticas (posições, texturas etc)
  const documentsData = [
    {
      id: 'RG',
      key: 'doc_rg',
      x: 400,
      y: scene.scale.height - 150,
      desc: 'Documento de identidade, necessário para se identificar.'
    },
    {
      id: 'CPF',
      key: 'doc_cpf',
      x: 800,
      y: scene.scale.height - 150,
      desc: 'Cadastro de Pessoa Física, usado em cadastros e registros.'
    },
    {
      id: 'CR',
      key: 'doc_comprovante',
      x: 200,
      y: scene.scale.height - 150,
      desc: 'Comprovante de residência, usado para confirmar seu endereço.'
    }
  ];

  return {
    group,
    documentsData,
    spawned: false, // ainda não criados no mundo
    completed: false, // missão concluída?
  };
}

// ======================================================
// LOOP DE ATUALIZAÇÃO PRINCIPAL
// ======================================================

export function updateDocuments(scene) {
  const { playerState, documents } = scene;
  if (!documents || !documents.group) return;

  // missão ainda não começou → nada acontece
  if (!playerState.hasMission) return;

  // missão começou → spawna os documentos (uma única vez)
  if (!documents.spawned && !documents.spawned) {
    spawnDocuments(scene);
    documents.spawned = true;
  }

  // monitora progresso
  checkMissionProgress(scene);
}

// ======================================================
// HELPERS — SPAWN / COLETA / PROGRESSO
// ======================================================

function spawnDocuments(scene) {
  if (scene.playerState.docsMissionCompleted) return;

  const { documentsData, group } = scene.documents;

  // cria sprite físico apenas quando a missão começa
  documentsData.forEach(data => {
    const doc = group.create(data.x, data.y, data.key).setScale(0.15);
    doc.docId = data.id;
    doc.docDesc = data.desc;
  });

  // colisão com o chão
  scene.physics.add.collider(group, scene.ground.ground);
  
  // overlap com o jogador
  scene.physics.add.overlap(scene.player, group, (_, doc) => {
    collectDocument(scene, doc);
  });
}

function collectDocument(scene, doc) {
  const { playerState } = scene;
  if (!playerState.hasMission) return;
  if (playerState.collectedDocs.includes(doc.docId)) return; // já coletado

  // Remove completamente o documento do mundo
  safelyDestroyDoc(doc);

  // Registra coleta
  playerState.collectedDocs.push(doc.docId);

  // Feedback visual e inventário
  scene.ui.showMessage(`Você encontrou o ${doc.docId}!\n${doc.docDesc}`);
  scene.ui.addToInventory(doc.texture.key);

  // Checa progresso
  checkMissionProgress(scene);
}

function checkMissionProgress(scene) {
  const { playerState, documents } = scene;
  const totalDocs = documents.documentsData.length;
  const collected = playerState.collectedDocs.length;

  // Já completou antes? Sai.
  if (documents.completed) return;

  // Completou agora?
  if (collected >= totalDocs) {
    documents.completed = true;
    playerState.docsMissionCompleted = true;
    playerState.hasMission = false;

    // Feedback e encerramento
    scene.time.delayedCall(2000, () => {
      scene.ui.showMessage("Você foi inscrito na CNH Popular! Agora, vamos em frente para a próxima etapa!");
    });
  }
}

// ======================================================
// FUNÇÃO AUXILIAR: destrói o documento com segurança
// ======================================================

function safelyDestroyDoc(doc) {
  if (!doc) return;
  if (doc.body) {
    doc.body.enable = false;
    doc.body.checkCollision.none = true;
  }
  doc.setVisible(false);
  doc.setActive(false);
  doc.destroy();
}