export function showWarning(scene, message) {
  const { width } = scene.scale;

  if (scene.currentMessageContainer) {
    scene.currentMessageContainer.destroy();
  }

  const fullText = "🚫 Interaja com " + message + " e conclua sua missão antes de ir para a próxima etapa!";

  const text = scene.add.text(
    0,
    0,
    fullText,
    {
      fontFamily: '"Silkscreen", monospace',
      fontSize: "14px",
      color: "#000000",
      align: "center",
      fontWeight: "600",
      lineSpacing: 3,
      wordWrap: {
        width: 500,
        useAdvancedWrap: true,
      },
    }
  ).setOrigin(0.5, 0.5);

  const textWidth = text.width;
  const textHeight = text.height;

  const container = scene.add.container(width, 50);
  
  const bg = scene.add.rectangle(
    0, 
    0, 
    textWidth + 60,
    textHeight + 30,
    0xffffff,
    1 
  ).setOrigin(0.5, 0.5);

  bg.setStrokeStyle(2, 0x000000, 1);

  const shadow = scene.add.rectangle(
    3,
    3,
    textWidth + 60,
    textHeight + 30,
    0x000000,
    0.3 
  ).setOrigin(0.5, 0.5);

  container.add([shadow, bg, text]);
  container.setDepth(1000);

  scene.currentMessageContainer = container;

  scene.time.delayedCall(3000, () => {
    if (scene.currentMessageContainer === container) {
      container.destroy();
      scene.currentMessageContainer = null;
    }
  });

  return container;
}