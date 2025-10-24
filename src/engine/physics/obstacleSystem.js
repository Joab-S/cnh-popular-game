export function setupObstacles(scene) {
  const obstacles = [];

  const { width, height } = scene.scale;

  const textures = ['obstacle_1', 'obstacle_2', 'obstacle_3'];

  const positions = [155, 430, 690];

  const sizes = [
    { w: 50, h: 65, y: height - 100 },
    { w: 45, h: 40, y: height - 87 },
    { w: 50, h: 65, y: height - 98 },
  ];
  
  positions.forEach((x, index) => {
    const texture = textures[index % textures.length];
    const size = sizes[index];
    
    const obs = scene.physics.add.staticSprite(x, size.y, texture);
    obs.setDisplaySize(size.w, size.h);
    obs.setOrigin(0.5);
    
    const hitboxWidth = size.w * 0.7;
    const hitboxHeight = size.h * 0.7;

    obs.body.setSize(hitboxWidth, hitboxHeight);
    obs.body.setOffset(
      (size.w - hitboxWidth) / 2,
      (size.h - hitboxHeight) / 2
    );

    obs.refreshBody();
    
    obstacles.push(obs);
  });

  return obstacles;
}

export function updateObstacles(scene) {
  // futuro: mover ou animar obstáculos
}
