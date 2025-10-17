export function setupObstacles(scene) {
  const group = scene.physics.add.staticGroup();
  const { width, height } = scene.scale;

  const positions = [300, 600, 900, 1200];
  positions.forEach(x => {
    const obs = group.create(x, height - 60, null);
    obs.displayWidth = 40;
    obs.displayHeight = 30;
    obs.setOrigin(0.5);
    obs.setTint(0x222222);
  });

  return group;
}


export function updateObstacles(scene) {
  // futuro: mover ou animar obstáculos
}
