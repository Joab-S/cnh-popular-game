/**
 * Sistema de seleção de personagem
 * @param {Phaser.Scene} scene
 * @param {function} onCharacterSelected
 */
export function setupCharacterSelection(scene, onCharacterSelected) {
    const { width, height } = scene.scale;

    scene.children.removeAll();

    const sceneBackground = scene.add.image(width / 2, height / 2, 'bg_intro')
        .setDisplaySize(width, height);

    const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.2);

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
        fontSize: '36px',
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
    
       // === INSTRUÇÃO COM IMAGENS ===
    const instructionY = boxHeight/2 - 40;
    
    // Texto principal
    const instructionText = scene.add.text(0, instructionY, 'Clique no personagem ou use as teclas para selecionar', {
        fontFamily: '"Silkscreen", "Courier New", monospace',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
        padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setOrigin(0.5);

    mainContainer.add([background, title, charactersContainer, instructionText]);
    
    // === CONFIGURAR CONTROLES DE TECLADO ===
    scene.keys = scene.input.keyboard.addKeys({
        A: Phaser.Input.Keyboard.KeyCodes.A,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
        RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });

    let characterSelected = false;

    const checkKeys = () => {
        if (characterSelected) return;
        
        if (scene.keys.A.isDown || scene.keys.LEFT.isDown) {
            characterSelected = true;
            selectCharacter(scene, 'boy', onCharacterSelected);
        } else if (scene.keys.D.isDown || scene.keys.RIGHT.isDown) {
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
function createCharacterOption(scene, x, y, textureKey, keyType, onClick) {
    const container = scene.add.container(x, y);
    
    // === CAIXA DO PERSONAGEM ===
    const optionWidth = 220;
    const optionHeight = 240;
    
    const background = scene.add.graphics();
    background.fillStyle(0xffffff, 0.4);
    background.fillRoundedRect(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight, 12);
    background.lineStyle(1, 0xffffff, 0.3);
    background.strokeRoundedRect(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight, 12);
    
    const sprite = scene.add.sprite(0, -10, textureKey)
        .setDisplaySize(100, 160);

    // === CONTAINER PARA AS TECLAS ===
    const keysContainer = scene.add.container(0, 90);
    
    if (keyType === 'TECLA A') {
        const keyAImage = scene.add.image(-25, 0, 'button_a')
            .setDisplaySize(35, 35);
        
        const orText = scene.add.text(5, 0, 'ou', {
            fontFamily: '"Silkscreen", "Courier New", monospace',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const leftArrowImage = scene.add.image(35, 0, 'button_left_2')
            .setDisplaySize(35, 35);
            
        keysContainer.add([keyAImage, orText, leftArrowImage]);
    } else {
        const keyDImage = scene.add.image(-25, 0, 'button_d')
            .setDisplaySize(35, 35);
        
        const orText = scene.add.text(5, 0, 'ou', {
            fontFamily: '"Silkscreen", "Courier New", monospace',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const rightArrowImage = scene.add.image(35, 0, 'button_right_2')
            .setDisplaySize(35, 35);
            
        keysContainer.add([keyDImage, orText, rightArrowImage]);
    }

    const border = scene.add.graphics();
    border.lineStyle(4, 0x000000, 0);
    border.strokeRoundedRect(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight, 12);

    const hoverOverlay = scene.add.graphics();
    hoverOverlay.fillStyle(0x000000, 0);
    hoverOverlay.fillRoundedRect(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight, 12);
    
    container.add([background, sprite, keysContainer, border, hoverOverlay]);
    
    const hitArea = new Phaser.Geom.Rectangle(-optionWidth/2, -optionHeight/2, optionWidth, optionHeight);
    
    container.setInteractive({
        hitArea: hitArea,
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true
    });
    
    const handlePointerOver = () => {
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
    };
    
    const handlePointerOut = () => {
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
    };
    
    const handlePointerDown = () => {
        if (onClick) {
            onClick();
        }
    };
    
    container.on('pointerover', handlePointerOver);
    container.on('pointerout', handlePointerOut);
    container.on('pointerdown', handlePointerDown);
    
    sprite.setInteractive({ useHandCursor: true });
    sprite.on('pointerover', handlePointerOver);
    sprite.on('pointerout', handlePointerOut);
    sprite.on('pointerdown', handlePointerDown);
    
    return container;
}

/**
 * Processa a seleção do personagem
 */
function selectCharacter(scene, character, callback) {    
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