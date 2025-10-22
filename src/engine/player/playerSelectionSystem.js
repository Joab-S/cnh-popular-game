/**
 * Sistema de seleção de personagem
 * @param {Phaser.Scene} scene - A cena onde a seleção será exibida
 * @param {function} onCharacterSelected - Callback quando o personagem é selecionado
 */
export function setupCharacterSelection(scene, onCharacterSelected) {
    const { width, height } = scene.scale;

    scene.children.removeAll();

    // === BACKGROUND DA CENA COM IMAGEM bg_intro ===
    const sceneBackground = scene.add.image(width / 2, height / 2, 'bg_intro')
        .setDisplaySize(width, height);

    // Overlay escuro para melhor contraste
    const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.3);

    const mainContainer = scene.add.container(width / 2, height / 2);
    
    // === CAIXA PRINCIPAL ===
    const boxWidth = 700;
    const boxHeight = 450;
    const border = 3;
    
    // === BACKGROUND SIMPLES DA CAIXA ===
    const background = scene.add.graphics();

    
    // === TÍTULO ===
    const title = scene.add.text(0, -boxHeight/2 + 50, 'ESCOLHA SEU PERSONAGEM!', {
        fontFamily: '"Silkscreen", "Courier New", monospace',
        fontSize: '24px',
        color: '#ffffff',
        fontWeight: 'bold',
        align: 'center'
    }).setOrigin(0.5);
    
    // === CONTAINER DOS PERSONAGENS ===
    const charactersContainer = scene.add.container(0, 0);

    const boyOption = createCharacterOption(scene, -120, 0, 'select_player_boy', 'TECLA A', () => {
        selectCharacter(scene, 'boy', onCharacterSelected);
    });

    const girlOption = createCharacterOption(scene, 120, 0, 'select_player_girl', 'TECLA D', () => {
        selectCharacter(scene, 'girl', onCharacterSelected);
    });
    
    charactersContainer.add([girlOption, boyOption]);
    
    // === INSTRUÇÃO ATUALIZADA ===
    const instruction = scene.add.text(0, boxHeight/2 - 40, 'Clique no personagem ou use as teclas para selecionar', {
        fontFamily: '"Silkscreen", "Courier New", monospace',
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        align: 'center',
        padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setOrigin(0.5);

    mainContainer.add([background, title, charactersContainer, instruction]);
    
    // === CONFIGURAR CONTROLES DE TECLADO ===
    scene.keys = scene.input.keyboard.addKeys({
        A: Phaser.Input.Keyboard.KeyCodes.A,
        D: Phaser.Input.Keyboard.KeyCodes.D
    });

    let characterSelected = false;

    const checkKeys = () => {
        if (characterSelected) return;
        
        if (scene.keys.A.isDown) {
            characterSelected = true;
            selectCharacter(scene, 'boy', onCharacterSelected);
        } else if (scene.keys.D.isDown) {
            characterSelected = true;
            selectCharacter(scene, 'girl', onCharacterSelected);
        }
    };

    scene.events.on('update', checkKeys);

    scene.events.once('shutdown', () => {
        scene.events.off('update', checkKeys);
    });
    
    // === ANIMAÇÃO DE ENTRADA ===
    mainContainer.setAlpha(0);
    mainContainer.setScale(0.8);
    scene.tweens.add({
        targets: mainContainer,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        ease: 'Back.easeOut'
    });
}

/**
 * Cria uma opção de personagem individual com imagem estática
 */
function createCharacterOption(scene, x, y, textureKey, keyInstruction, onClick) {
    const container = scene.add.container(x, y);
    
    // === CAIXA DO PERSONAGEM ===
    const optionWidth = 220;
    const optionHeight = 240;
    
const background = scene.add.graphics();
    background.fillStyle(0xffffff, 0.15); // Branco com apenas 15% de opacidade
    background.fillRoundedRect(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight, 12);
    background.lineStyle(1, 0xffffff, 0.3); // Borda branca bem suave
    background.strokeRoundedRect(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight, 12);
    
    const sprite = scene.add.sprite(0, -10, textureKey)
        .setDisplaySize(120, 160)
        .setInteractive({ useHandCursor: true });

    // === INSTRUÇÃO DA TECLA ===
    const keyText = scene.add.text(0, 90, keyInstruction, {
        fontFamily: '"Silkscreen", "Courier New", monospace',
        fontSize: '16px',
        color: '#000000',
        fontWeight: 'bold',
        align: 'center',
        backgroundColor: '#ffffff',
        padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setOrigin(0.5);

    const border = scene.add.graphics();
    border.lineStyle(4, 0x000000, 0);
    border.strokeRoundedRect(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight, 12);

    const hoverOverlay = scene.add.graphics();
    hoverOverlay.fillStyle(0x000000, 0);
    hoverOverlay.fillRoundedRect(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight, 12);
    
    container.add([background, sprite, keyText, border, hoverOverlay]);
    
    // === EFEITOS DE HOVER E CLIQUE ===
    sprite.on('pointerover', () => {
        scene.tweens.add({
            targets: [border, hoverOverlay],
            alpha: 0.3,
            duration: 200,
            ease: 'Linear'
        });
        scene.tweens.add({
            targets: container,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 200,
            ease: 'Back.easeOut'
        });
    });
    
    sprite.on('pointerout', () => {
        scene.tweens.add({
            targets: [border, hoverOverlay],
            alpha: 0,
            duration: 200,
            ease: 'Linear'
        });
        scene.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });
    });
    
    // === EVENTO DE CLIQUE ===
    sprite.on('pointerdown', () => {
        if (onClick) {
            onClick();
        }
    });
    
    return container;
}

/**
 * Processa a seleção do personagem
 */
function selectCharacter(scene, character, callback) {
    console.log('Personagem selecionado:', character);
    
    scene.cameras.main.flash(200, 255, 255, 255);
    scene.cameras.main.shake(200, 0.01);
    
    scene.time.delayedCall(300, () => {
        if (callback) {
            callback(character);
        }
    });
}

/**
 * Limpa a seleção de personagem e prepara para o jogo
 */
export function clearCharacterSelection(scene) {
    const containers = scene.children.list.filter(child => child.type === 'Container');
    
    scene.tweens.add({
        targets: containers,
        alpha: 0,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 300,
        ease: 'Back.easeIn',
        onComplete: () => {
            scene.children.removeAll();
        }
    });
}

/**
 * Inicia o jogo com o personagem selecionado
 */
export function startGameWithCharacter(scene, character) {
    clearCharacterSelection(scene);
    
    const playerTexture = character === 'girl' ? 'player_girl' : 'player_boy';
    
    scene.time.delayedCall(350, () => {
        scene.scene.start('GameScene', { 
            selectedCharacter: character,
            playerTexture: playerTexture 
        });
    });
}