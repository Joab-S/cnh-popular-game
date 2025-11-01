export function pressKeyIcon(scene, beforeText, afterText, x, y, textureKey, scale) {
  const { width, height } = scene.scale;
  const posX = x ?? width / 2;
  const posY = y ?? height - 60;

  const text1 = scene.add.text(0, 0, beforeText, {
    fontFamily: '"Silkscreen", monospace',
    fontSize: "18px",
    color: "#ffffff",
  }).setOrigin(0, 0.5);

  const icon = scene.add.image(text1.width + 10, 0, textureKey)
    .setOrigin(0, 0.5)
    .setScale(scale);

  const text2 = scene.add.text(
    text1.width + icon.displayWidth + 20,
    0,
    afterText,
    {
      fontFamily: '"Silkscreen", monospace',
      fontSize: "18px",
      color: "#ffffff",
    }
  ).setOrigin(0, 0.5);

  const container = scene.add.container(
    posX - (text1.width + icon.displayWidth + text2.width) / 2,
    posY,
    [text1, icon, text2]
  );

  return container;
}