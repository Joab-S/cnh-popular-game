// src/engine/camera/cameraSystem.js

/**
 * Inicializa a câmera principal com parâmetros padrão.
 * Deve ser chamado em toda nova fase.
 */
export function initCamera(scene, target = null, boundsWidth = null, boundsHeight = null) {
  const cam = scene.cameras.main;
  cam.fadeIn(600, 0, 0, 0);

  // Caso tenha player ou outro alvo
  if (target) {
    startFollow(scene, target);
  }

  // Define limites do mundo (opcional)
  if (boundsWidth && boundsHeight) {
    setBounds(scene, boundsWidth, boundsHeight);
  }

  // Configurações gerais
  cam.setZoom(1);           // zoom padrão
  cam.setRoundPixels(true); // evita serrilhado em pixel art
  cam.scrollX = 0;          // começa do início
  cam.scrollY = 0;
}

/**
 * Faz a câmera seguir suavemente um alvo (ex: jogador).
 */
export function startFollow(scene, target, lerpX = 0.1, lerpY = 0.1) {
  const cam = scene.cameras.main;
  if (!target) return;
  cam.startFollow(target, true, lerpX, lerpY);
}

/**
 * Define os limites da câmera e do mundo físico (mantém em sincronia).
 */
export function setBounds(scene, width, height) {
  const cam = scene.cameras.main;
  cam.setBounds(0, 0, width, height);
  if (scene.physics?.world) {
    scene.physics.world.setBounds(0, 0, width, height);
  }
}

/**
 * Executa um fade-in na tela.
 */
export function fadeIn(scene, duration = 800, color = 0x000000) {
  scene.cameras.main.fadeIn(duration, (color >> 16) & 255, (color >> 8) & 255, color & 255);
}

/**
 * Executa um fade-out e dispara callback quando terminar.
 */
export function fadeOut(scene, duration = 800, color = 0x000000, callback = null) {
  const cam = scene.cameras.main;
  cam.fadeOut(duration, (color >> 16) & 255, (color >> 8) & 255, color & 255);
  if (callback) {
    cam.once('camerafadeoutcomplete', callback);
  }
}

/**
 * Aplica um pequeno shake (tremor) para impacto visual.
 */
export function shake(scene, duration = 200, intensity = 0.01) {
  scene.cameras.main.shake(duration, intensity);
}

/**
 * Transição simples entre áreas (fade-out -> callback -> fade-in).
 */
export function transition(scene, callback, duration = 800) {
  const cam = scene.cameras.main;

  cam.fadeOut(duration, 0, 0, 0);
  
  cam.once('camerafadeoutcomplete', () => {
    if (callback) callback();

    scene.time.delayedCall(100, () => {
      fadeIn(scene, duration);
    });
  });
}
