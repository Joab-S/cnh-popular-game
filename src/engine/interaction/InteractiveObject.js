import { setupInteractiveObject } from './interactionSystem.js';

/**
 * Classe base para qualquer objeto interativo fixo.
 * Usa setupInteractiveObject() para registro automático.
 */
export default class InteractiveObject {
  constructor(scene, config) {
    const {
      key,
      x, y,
      texture,
      frame,
      scale = 1,
      width = 60,
      height = 100,
      color = 0x3366ff,
      dialogs = [],
      onInteract = null,
      proximity = { x: 60, y: 40 },
      exposeToScene = true,
      label,
      hintText = 'Aproxime-se e aperte E',
      hintTexture = null,
    } = config;

    this.scene = scene;

    // === Criação visual ===
    if (texture) {
      this.sprite = scene.physics.add.sprite(x, y, texture, frame);
      this.sprite.setScale(scale);
    } else {
      this.sprite = scene.add.rectangle(x, y, width, height, color);
      scene.physics.add.existing(this.sprite);
    }

    // === Física ===
    const body = this.sprite.body;
    if (body) {
      body.setAllowGravity(false);
      body.setImmovable(true);
      const w = this.sprite.displayWidth || width;
      const h = this.sprite.displayHeight || height;
      body.setSize(w, h);
      body.setOffset(0, 0);
    }

    // === Expor no scene (compatibilidade com scripts legados) ===
    if (exposeToScene && key) {
      scene[key] = this.sprite;
    }

    // === Registrar no sistema de interação ===
    setupInteractiveObject(scene, {
      key,
      object: this.sprite,
      dialogs,
      onInteract,
      proximity,
      hintText,
      hintTexture,
    });

    // === Label (opcional) ===
    if (label) {
      this.label = scene.add.text(
        x,
        y * 0.85,
        label,
        {
          fontSize: '14px',
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: { x: 6, y: 3 }
        }
      ).setOrigin(0.5);
    }
  }
}
