export function setupUI(scene) {
  const { width, height } = scene.scale;

  const inventory = scene.add.container(width / 2, height - 20).setScrollFactor(0);

  const messageBox = scene.add.container(scene.scale.width / 2, 60).setScrollFactor(0).setDepth(10);
  messageBox.setAlpha(0);

  const background = scene.add.graphics();
  const textWidth = 600;
  const textHeight = 50;

  background.fillStyle(0x000000, 0.4);
  background.fillRect(-textWidth/2 + 2, -textHeight/2 + 2, textWidth, textHeight);

  background.fillStyle(0x000000, 0.95);
  background.fillRect(-textWidth/2, -textHeight/2, textWidth, textHeight);

  background.lineStyle(1, 0x666666, 0.8);
  background.strokeRect(-textWidth/2, -textHeight/2, textWidth, textHeight);
  
  const messageText = scene.add.text(0, 0, '', {
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#ffffff',
    align: 'center',
    fontWeight: '600',
    lineSpacing: 4,
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
      const icon = scene.add.image(0, 0, key).setScale(0.1).setScrollFactor(0);
      const itemCount = inventory.list.length;
      const horizontalSpacing = 80;

      const offset = (itemCount * horizontalSpacing) - ((itemCount - 1) * horizontalSpacing / 2);
      
      icon.setPosition(offset, 0);
      inventory.add(icon);
      
      const totalItems = inventory.list.length;
      const totalWidth = (totalItems - 1) * horizontalSpacing;
      inventory.setX(scene.scale.width / 2 - totalWidth / 2);
    }
  };
}

export function updateUI(_scene) {
  // espaço para HUD futuramente
}