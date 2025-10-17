/**
 * Limpa com segurança a cena atual, preservando apenas os objetos passados.
 * @param {Phaser.Scene} scene 
 * @param {Phaser.GameObjects.GameObject[]} keepObjects 
 */
export function clearScene(scene, keepObjects = []) {
  if (!scene || !scene.children) return;

  const keep = new Set(keepObjects.filter(o => o));

  // === 1. Destrói todos os objetos visuais e containers ===
  for (const obj of [...scene.children.list]) {
    if (!keep.has(obj)) {
      try {
        obj.destroy(true);
      } catch (err) {
        console.warn("Falha ao destruir objeto:", err);
      }
    }
  }

  // === 2. Remove colliders e corpos físicos não preservados ===
  if (scene.physics?.world) {
    // remove todos os colliders
    scene.physics.world.colliders.destroy();

    // destrói corpos individuais não preservados
    for (const body of [...scene.physics.world.bodies.entries]) {
      if (!keep.has(body.gameObject)) {
        try {
          body.destroy();
        } catch (err) {
          // ignora erros do Phaser para corpos já removidos
        }
      }
    }
  }

  // === 3. Remove timers que não pertencem a objetos preservados ===
  if (scene.time && scene.time.events) {
    for (const event of [...scene.time.events]) {
      if (!keep.has(event.callbackScope)) {
        try {
          scene.time.removeEvent(event);
        } catch {}
      }
    }
  }

  // === 4. Limpa referências comuns de cenário ===
  scene.ground = null;
  scene.obstacles = null;
  scene.detran = null;
  scene.pc = null;
  scene.homeZone = null;
  scene.phase2 = null;

  // Player e UI permanecem, pois estão em "keepObjects"
}
