import { controlHints } from "../utils/controlHints";

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
    
    // Usando a nova função para duas teclas
    const jumpHint = controlHints(
      scene,
      '',           // texto antes
      'ou',         // texto entre as teclas
      '',           // texto depois
      width / 2, 
      height - 25,
      'button_w',   // primeira tecla
      'button_up_2', // segunda tecla
      0.15
    );

    jumpHint.setScrollFactor(0);
    jumpHint.setDepth(100);
    jumpHint.setAlpha(0);

    obstacleHints.push({
      container: jumpHint,
      obstacle: obs,
      shown: false
    });

    obstacles.push(obs);
  });

  if (scene.player) {
    scene.physics.add.collider(scene.player, obstacles, (player, obstacle) => {
      const hintData = obstacleHints.find(hint => hint.obstacle === obstacle);
      
      if (hintData) {
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
            ease: 'Linear'
          });
        });
      }
    });
  }

  return obstacles;
}