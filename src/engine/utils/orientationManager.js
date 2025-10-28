export function setupOrientation(scene) {
  const { width, height } = scene.scale;

  const overlay = scene.add
    .rectangle(0, 0, width, height, 0x000000, 0.8)
    .setOrigin(0)
    .setScrollFactor(0)
    .setDepth(9998)
    .setVisible(false);

  const text = scene.add
    .text(width / 2, height / 2, "↻ Vire o celular para jogar", {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(9999)
    .setVisible(false);

  function updateOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    overlay.setVisible(isPortrait);
    text.setVisible(isPortrait);

    if (isPortrait) {
      if (!scene.scene.isPaused(scene.scene.key)) scene.scene.pause();
    } else {
      if (scene.scene.isPaused(scene.scene.key)) scene.scene.resume();
    }
  }

  // Checa na inicialização e em cada resize
  scene.scale.on("resize", updateOrientation);
  window.addEventListener("orientationchange", updateOrientation);
  window.addEventListener("resize", updateOrientation);

  // Checa no primeiro frame (para garantir que o jogo carregue)
  scene.events.once("update", () => updateOrientation());
}
