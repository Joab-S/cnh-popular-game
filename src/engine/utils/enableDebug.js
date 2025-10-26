export function enableDebug(scene, { initialOn = false } = {}) {
  if (!scene?.physics?.world) {
    console.warn("[DEBUG] Cena ou mundo de física inválidos.");
    return;
  }

  const world = scene.physics.world;

  if (!world.debugGraphic || world.debugGraphic.scene !== scene) {
    world.createDebugGraphic();
  }

  world.drawDebug = initialOn;

  const g = world.debugGraphic;
  if (g) {
    g.setDepth(9999);
    g.setScrollFactor(1);
    g.setVisible(world.drawDebug);
    if (!world.drawDebug) g.clear();
  }

  console.log(`[DEBUG] Arcade Physics: ${world.drawDebug ? "ON" : "OFF"} (initial)`);
}

export function setupDebugToggle(scene, key = "P") {
  if (!scene?.physics?.world) return;

  if (scene._debugToggleBound) return;
  scene._debugToggleBound = true;

  scene.input.keyboard.on(`keydown-${key}`, () => {
    const world = scene.physics.world;

    if (!world.debugGraphic || world.debugGraphic.scene !== scene) {
      world.createDebugGraphic();
    }
    const g = world.debugGraphic;

    const turningOn = !(world.drawDebug && g?.visible);

    if (turningOn) {
      world.drawDebug = true;
      if (g) {
        g.setVisible(true);
        g.setDepth(9999);
      }
      console.log(`[DEBUG] ON via tecla ${key}`);
    } else {
      world.drawDebug = false;
      if (g) {
        g.clear();
        g.setVisible(false);
      }
      console.log(`[DEBUG] OFF via tecla ${key}`);
    }
  });
}
