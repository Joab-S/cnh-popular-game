export function setupPlayer(scene, x, y, textureKey = "player_boy") {
  const player = scene.physics.add.sprite(x, y, textureKey, 0);
  player.setCollideWorldBounds(true);
  player.setBounce(0);
  player.setScale(0.45);
  scene.physics.add.collider(player, scene.ground.ground);

  // animações - usa a textureKey fornecida
  if (!scene.anims.exists("walk")) {
    scene.anims.create({
      key: "walk",
      frames: scene.anims.generateFrameNumbers(textureKey, {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });
    scene.anims.create({
      key: "idle",
      frames: [{ key: textureKey, frame: 0 }],
      frameRate: 1,
    });
  }

  return player;
}

export function updatePlayerMovement(scene) {
  const { player, keys, playerState } = scene;
  if (!player || !keys) return;

  if (!playerState?.canMove) {
    player.setVelocityX(0);
    player.play("idle", true);
    return;
  }

  const speed = 160;

  if (keys.A.isDown || keys.LEFT.isDown) {
    player.setVelocityX(-speed);
    player.flipX = true;
    player.play("walk", true);
  } else if (keys.D.isDown || keys.RIGHT.isDown) {
    player.setVelocityX(speed);
    player.flipX = false;
    player.play("walk", true);
  } else {
    player.setVelocityX(0);
    player.play("idle", true);
  }

  // pulo
  if (
    (keys.W.isDown || keys.SPACE.isDown || keys.UP.isDown) &&
    player.body.blocked.down
  ) {
    player.setVelocityY(-400);
  }
}
