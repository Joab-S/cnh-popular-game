import DialogBubble from "../ui/DialogBubble.js";

/**
 * ======================
 * SISTEMA DE INTERAÇÃO GENÉRICO
 * ======================
 * Responsável por todos os objetos interativos (NPCs, PCs, placas etc).
 */
export function setupInteractiveObject(scene, config) {
  const {
    key,
    object,
    dialogs = [],
    onInteract = null,
    proximity = { x: 60, y: 40 },
    hintText = "Aproxime-se e aperte E",
  } = config;

  const hint = scene.add
    .text(object.x, object.y * 0.75, hintText, {
      fontFamily: '"Silkscreen", monospace',
      padding: { x: 12, y: 8 },
      fontSize: "12px",
      color: "#000000",
      backgroundColor: "#FFFFFF", 
    })
    .setOrigin(0.5)
    .setAlpha(0)
    .setDepth(1000);

  if (!scene.interactiveObjects) scene.interactiveObjects = [];

  scene.interactiveObjects.push({
    key,
    object,
    hint,
    dialogs,
    onInteract,
    dialog: null,
    dialogIndex: 0,
    proximity,
  });
}

/**
 * Atualiza todos os objetos interativos do cenário.
 * Deve ser chamado no update() da cena.
 */
export function updateGenericInteractions(scene) {
  const { player, keys, interactiveObjects } = scene;
  if (!player || !interactiveObjects) return;
  if (scene.playerState?.quizActive || scene.playerState?.miniGameActive)
    return;

  interactiveObjects.forEach((entry) => {
    if (!entry.object || !entry.object.active) return;

    const dx = Math.abs(player.x - entry.object.x);
    const dy = Math.abs(player.y - entry.object.y);
    const near = dx < entry.proximity.x && dy < entry.proximity.y;

    toggleHint(scene, entry.hint, near);

    if (
      near &&
      (Phaser.Input.Keyboard.JustDown(keys.E) || scene.buttons.action)
    ) {
      scene.buttons.action = false;

      progressDialog(scene, entry);
    }
  });
}

/**
 * Exibe e avança falas
 */
function progressDialog(scene, entry) {
  // Garante que playerState exista
  if (!scene.playerState) {
    scene.playerState = { canMove: true, inDialog: false };
  }

  // 1️⃣ Já existe diálogo ativo → avança fala
  if (scene.playerState.inDialog && entry.dialog) {
    entry.dialogIndex++;
    if (entry.dialogIndex < entry.dialogs.length) {
      entry.dialog.updateText(entry.dialogs[entry.dialogIndex]);
      return;
    }

    // Diálogo terminou
    entry.dialog.destroy();
    entry.dialog = null;
    scene.playerState.canMove = true;
    scene.playerState.inDialog = false;

    // Chama callback específico do objeto (ex: NPC, PC etc)
    if (entry.onInteract) entry.onInteract(scene);

    return;
  }

  // 2️⃣ Sem diálogo — inicia a primeira fala (se houver)
  if (entry.dialogs && entry.dialogs.length > 0) {
    try {
      entry.dialogIndex = 0;
      entry.dialog = new DialogBubble(scene, entry.dialogs[0]);
      scene.playerState.canMove = false;
      scene.playerState.inDialog = true;
      toggleHint(scene, entry.hint, false);
    } catch (err) {
      console.error("Erro ao criar DialogBubble:", err);
      scene.playerState.canMove = true;
      scene.playerState.inDialog = false;
    }
  }

  // 3️⃣ Caso não haja falas, executa ação direta
  else if (entry.onInteract) {
    entry.onInteract(scene);
  }
}

/**
 * Mostra ou oculta o texto de “Aproxime-se e aperte E”
 */
function toggleHint(scene, hint, visible) {
  if (!hint) return;
  const targetAlpha = visible ? 0.8 : 0;
  
  if (scene.tweens) {
    scene.tweens.killTweensOf(hint);
  }

  hint.setAlpha(targetAlpha);
}

export function clearInteractions(scene) {
  if (!scene.interactiveObjects) return;

  for (const entry of scene.interactiveObjects) {
    try {
      if (entry.hint?.destroy) entry.hint.destroy();
      if (entry.object?.destroy) entry.object.destroy();
      if (entry.dialog?.destroy) entry.dialog.destroy();
    } catch (err) {
      console.warn("Falha ao limpar interação:", err);
    }
  }

  scene.interactiveObjects.length = 0;
}
