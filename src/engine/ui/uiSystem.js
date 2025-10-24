export function setupUI(scene) {
  const { width, height } = scene.scale;

  // === INVENTÁRIO ===
  const inventory = scene.add.container(100, height - 60).setScrollFactor(0).setDepth(10);    

  const inventoryBg = scene.add.graphics();
  inventoryBg.setAlpha(0);
  
  const bgWidth = 150;
  const bgHeight = 70;

  inventoryBg.fillStyle(0x000000, 0.5);
  inventoryBg.fillRoundedRect(-bgWidth/2 + 2, -bgHeight/2 + 2, bgWidth, bgHeight, 6);

  inventoryBg.fillStyle(0xffffff, 0.95);
  inventoryBg.fillRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 6);

  inventoryBg.lineStyle(2, 0x000000, 0.6);
  inventoryBg.strokeRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 6);

  inventoryBg.lineStyle(1, 0x1a140d, 0.9);
  inventoryBg.strokeRoundedRect(-bgWidth/2 + 1, -bgHeight/2 + 1, bgWidth - 2, bgHeight - 2, 5);

  inventoryBg.lineStyle(1, 0x000000, 0.6);
  inventoryBg.strokeRoundedRect(-bgWidth/2 + 3, -bgHeight/2 + 3, bgWidth - 6, 8, 3);

  inventoryBg.fillStyle(0x000000, 0.7);
  inventoryBg.fillRect(-5, -bgHeight/2 + 10, 10, 4);

  inventory.add([inventoryBg]);

  // === MESSAGE BOX ===
  const messageBox = scene.add.container(scene.scale.width / 2, 60).setScrollFactor(0).setDepth(10);
  messageBox.setAlpha(0);

  const background = scene.add.graphics();
  const textWidth = 600;
  const textHeight = 80;

  background.fillStyle(0x000000, 0.4);
  background.fillRect(-textWidth/2 + 2, -textHeight/2 + 2, textWidth, textHeight);

  background.fillStyle(0x000000, 0.95);
  background.fillRect(-textWidth/2, -textHeight/2, textWidth, textHeight);

  background.lineStyle(1, 0x666666, 0.8);
  background.strokeRect(-textWidth/2, -textHeight/2, textWidth, textHeight);
  
  const messageText = scene.add.text(0, 0, '', {
    fontFamily: '"Silkscreen", monospace',
    fontSize: '14px',
    color: '#ffffff',
    align: 'center',
    fontWeight: '600',
    lineSpacing: 3,
    wordWrap: { 
      width: textWidth - 20,
      useAdvancedWrap: true 
    }
  }).setOrigin(0.5, 0.5);

  messageBox.add([background, messageText]);

  return {
    inventory,
    messageBox,
    messageText,
    showMessage: (text, duration = 4000) => {
      messageText.setText(text);
      
      scene.tweens.killTweensOf(messageBox);
      
      scene.tweens.chain({
        targets: messageBox,
        tweens: [
          {
            alpha: 1,
            duration: 300,
            ease: 'Power2'
          },
          {
            alpha: 1,
            duration: duration,
            ease: 'Linear'
          },
          {
            alpha: 0,
            duration: 500,
            ease: 'Power2'
          }
        ]
      });
    },
    
    hideMessage: () => {
      scene.tweens.killTweensOf(messageBox);
      scene.tweens.add({
        targets: messageBox,
        alpha: 0,
        duration: 300,
        ease: 'Power2'
      });
    },
    
    addToInventory: (key) => {
      const items = inventory.list.filter(item => item.type === 'Image');
      const itemCount = items.length;
      
      const horizontalSpacing = 45;
      const maxItems = 3;
      
      const centerOffset = ((maxItems - 1) * horizontalSpacing) / 2;
      const x = (itemCount * horizontalSpacing) - centerOffset;
      const y = 0;
      
      const icon = scene.add.image(x, y, key)
        .setScale(0.07)
        .setScrollFactor(0);
      
      inventory.add(icon);

      if (itemCount === 0) {
        scene.tweens.add({
          targets: inventoryBg,
          alpha: 1,
          duration: 300,
          ease: 'Power2'
        });
      }
    },
  };
}

export function updateUI(_scene) {
  // espaço para HUD futuramente
}