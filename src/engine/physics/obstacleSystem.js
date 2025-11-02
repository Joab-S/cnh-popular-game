export function setupObstacles(scene) {
  const obstacles = [];
  const obstacleHints = [];

  const { width, height } = scene.scale;

  const textures = ['obstacle_1', 'obstacle_2', 'obstacle_3'];

  const positions = [165, 435, 690];

  const sizes = [
    { w: 50, h: 65, y: height - 90 },
    { w: 45, h: 40, y: height - 77 },
    { w: 50, h: 65, y: height - 88 },
  ];
  
  positions.forEach((x, index) => {
    const texture = textures[index % textures.length];
    const size = sizes[index];
    
    const obs = scene.physics.add.staticSprite(x, size.y, texture);
    obs.setDisplaySize(size.w, size.h);
    obs.setOrigin(0.5);
    
    const hitboxWidth = width;
    const hitboxHeight = 10;

    obs.body.setSize(hitboxWidth, hitboxHeight);
    obs.body.setOffset(
      (size.w - hitboxWidth) / 2,
      (size.h - hitboxHeight) / 2
    );

    obs.refreshBody();
    
    const hintContainer = scene.add.container(width / 2, height - 25)
      .setScrollFactor(0)
      .setDepth(100);

    const bg = scene.add.graphics();
    const bgWidth = 380;
    const bgHeight = 35;
    
    bg.fillStyle(0x000000, 0.3);
    bg.fillRect(-bgWidth/2 + 2, -bgHeight/2 + 2, bgWidth, bgHeight);
    
    bg.fillStyle(0xffffff, 1);
    bg.fillRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight);
    
    bg.lineStyle(2, 0x000000, 1);
    bg.strokeRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight);

    const hintText = scene.add.text(-135, 0, 'Pressione', {
      fontFamily: '"Silkscreen", monospace',
      fontSize: '14px',
      color: '#000000',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const keyD = scene.add.image(-75, 0, 'button_d')
      .setDisplaySize(25, 25);

    const plusSign1 = scene.add.text(-55, 0, '+', {
      fontFamily: '"Silkscreen", monospace',
      fontSize: '14px',
      color: '#000000',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const keyW = scene.add.image(-35, 0, 'button_w')
      .setDisplaySize(25, 25);

    const orText = scene.add.text(-10, 0, 'ou', {
      fontFamily: '"Silkscreen", monospace',
      fontSize: '14px',
      color: '#000000',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const arrowRight = scene.add.image(15, 0, 'button_right_2')
      .setDisplaySize(25, 25);

    const plusSign2 = scene.add.text(35, 0, '+', {
      fontFamily: '"Silkscreen", monospace',
      fontSize: '14px',
      color: '#000000',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const arrowUp = scene.add.image(55, 0, 'button_up_2')
      .setDisplaySize(25, 25);

    const jumpText = scene.add.text(125, 0, 'para pular', {
      fontFamily: '"Silkscreen", monospace',
      fontSize: '14px',
      color: '#000000',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    hintContainer.add([
      bg, 
      hintText, keyD, plusSign1, keyW, orText, 
      arrowRight, plusSign2, arrowUp, jumpText
    ]);

    hintContainer.setAlpha(0);

    obstacleHints.push({
      container: hintContainer,
      obstacle: obs,
      shown: false
    });

    obstacles.push(obs);
  });

  if (scene.player) {
    scene.physics.add.collider(scene.player, obstacles, (player, obstacle) => {
      const hintData = obstacleHints.find(hint => hint.obstacle === obstacle);
      
      if (hintData && !hintData.shown) {
        hintData.shown = true;
        
        scene.tweens.add({
          targets: hintData.container,
          alpha: 1,
          duration: 300,
          ease: 'Linear'
        });

        scene.time.delayedCall(3000, () => {
          scene.tweens.add({
            targets: hintData.container,
            alpha: 0,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
              hintData.container.destroy();
            }
          });
        });
      }
    });
  }

  return obstacles;
}

export function updateObstacles(scene) {
  // futuro: mover ou animar obstáculos
}