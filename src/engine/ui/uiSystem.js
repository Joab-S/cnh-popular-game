export function setupUI(scene) {
  const inventory = scene.add.container(scene.scale.width - 100, 50).setScrollFactor(0);
  const messageBox = scene.add.text(scene.scale.width / 2, 60, '', {
    fontSize: '14px',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: { x: 10, y: 5 },
    align: 'center'
  }).setOrigin(0.5).setAlpha(0).setDepth(10);

  return {
    inventory,
    messageBox,
    showMessage: (text) => {
      messageBox.setText(text);
      scene.tweens.add({
        targets: messageBox,
        alpha: 1,
        duration: 200,
        yoyo: true,
        hold: 1200,
        onComplete: () => messageBox.setAlpha(0)
      });
    },
    addToInventory: (key) => {
      const icon = scene.add.image(0, 0, key).setScale(0.1).setScrollFactor(0);
      const offset = inventory.list.length * 40;
      icon.setPosition(offset, 0);
      inventory.add(icon);
    }
  };
}

export function updateUI(_scene) {
  // espaço para HUD futuramente
}
