export function controlHints(scene, beforeText, betweenText, afterText, x, y, textureKey1, textureKey2, scale) {
  const { width, height } = scene.scale;
  const posX = x ?? width / 2;
  const posY = y ?? height - 60;

  const text1 = scene.add.text(0, 0, beforeText, {
    fontFamily: '"Silkscreen", monospace',
    fontSize: "18px",
    color: "#ffffff",
  }).setOrigin(0, 0.5);

  const icon1 = scene.add.image(text1.width + 5, 0, textureKey1)
    .setOrigin(0, 0.5)
    .setScale(scale);

  const textBetween = scene.add.text(
    text1.width + icon1.displayWidth + 10,
    0,
    betweenText,
    {
      fontFamily: '"Silkscreen", monospace',
      fontSize: "18px",
      color: "#ffffff",
    }
  ).setOrigin(0, 0.5);

  const icon2 = scene.add.image(
    text1.width + icon1.displayWidth + textBetween.width + 15,
    0,
    textureKey2
  ).setOrigin(0, 0.5)
  .setScale(scale);

  const text2 = scene.add.text(
    text1.width + icon1.displayWidth + textBetween.width + icon2.displayWidth + 20,
    0,
    afterText,
    {
      fontFamily: '"Silkscreen", monospace',
      fontSize: "18px",
      color: "#ffffff",
    }
  ).setOrigin(0, 0.5);

  const container = scene.add.container(
    posX - (text1.width + icon1.displayWidth + textBetween.width + icon2.displayWidth + text2.width) / 2,
    posY,
    [text1, icon1, textBetween, icon2, text2]
  );

  return container;
}