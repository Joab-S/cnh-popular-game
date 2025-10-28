import * as CameraSystem from '../../engine/camera/cameraSystem.js';
import { AREAS, WORLD_SIZE } from '../../core/config.js';
import InteractiveObject from '../../engine/interaction/InteractiveObject.js';

export function startPhase8(scene) {
  const { width, height } = scene.scale;

  scene.playerState = {
    ...scene.playerState,
    canMove: true,
    inDialog: false,
    currentArea: AREAS.finalScene,
    hasLicense: false
  };

  CameraSystem.initCamera(scene, scene.player, WORLD_SIZE, height);
  scene.physics.world.setBounds(0, 0, WORLD_SIZE, height);

  const groundRect = scene.add.rectangle(WORLD_SIZE / 2, height - 30, WORLD_SIZE, 64, 0x444444);

  scene.physics.add.existing(groundRect, true);
  scene.physics.add.collider(scene.player, groundRect);
  scene.ground = { ground: groundRect };
  groundRect.setVisible(false);

  scene.add.image(width / 2, height / 2, "final_bg")
    .setDepth(-2)
    .setScale(0.46);

  scene.add.image(width / 2 + 600, height / 2, "final_bg_2")
    .setDepth(-2)
    .setScale(0.46);

  scene.addLicenseToInventory = function() {
    if (!scene.playerState.hasLicense) {
      scene.ui.addToInventory("habilitacao");

      scene.playerState.hasLicense = true;

      scene.ui.showMessage("Carteira de habilitação adicionada ao inventário!");

      const mailObject = scene.interactiveObjects.find(obj => obj.key === "mail");
      if (mailObject) {
        mailObject.dialogs = ["Você já pegou sua carteira de habilitação!"];
      }
    }
  };

  const mother = new InteractiveObject(scene, {
    key: "mother",
    x: width - 350,
    y: height - 150,
    scale: 0.17,
    texture: "mother",
    label: "",
    dialogs: [
      "Estou orgulhosa de você, filho(a)!",
      "Nossa família sempre soube que você conseguiria concluir esse processo com muito respeito e controle!",
    ],
    hintText: "",
  });

  const car_final = new InteractiveObject(scene, {
    key: "car_final",
    x: width + 200,
    y: height - 155,
    texture: "car_final",
    scale: 0.48,
    label: "",
    dialogs: [
      "Que vitória, hein, amigo(a)?",
      "Lembra das três marchas da vida? Respeito, família e controle?",
      "A quarta marcha, nós dois juntos construiremos, campeã(o)!",
    ],
    onInteract: () => {
      if (scene.playerState.hasLicense) {
        scene.ui.showMessage('Agora você está devidamente habilitado para dirigir!');
      } else {
        scene.ui.showMessage('Opa, você precisa pegar sua habilitação na caixa de correios para dirigir!');
      }
  },
    hintText: "",
  });

  const brother = new InteractiveObject(scene, {
    key: "brother",
    x: width - 270,
    y: height - 140,
    texture: "brother",
    scale: 0.17,
    label: "",
    dialogs: [
      "Finalmente meu(inha) irmã(o) vai poder me levar até meu restaurante preferido, o 'Comida Boa'! Nunca fui tão feliz!",
    ],
    hintText: "",
  });

  const grandpa = new InteractiveObject(scene, {
    key: "grandpa",
    x: width - 130,
    y: height - 154,
    texture: "grandpa",
    scale: 0.172,
    label: "",
    dialogs: [
      "Meu(inha) querido(a), vou te falar uma coisa...",
      "Eu já vendi muito mel durante a minha vida...",
      "Mas nenhum mel tem a doçura de te ver conquistando sua habilitação.",
      "Meus dias serão muito mais adocicados pela felicidade do seu sucesso!",
    ],
    hintText: "",
  });

  const mail = new InteractiveObject(scene, {
    key: "mail",
    x: width - 530,
    y: height - 140,
    texture: "mail",
    scale: 0.22,
    label: "",
    dialogs: [
      "Opa! Sua carteira de motorista acaba de chegar!",
    ],
    onInteract: () => {
      scene.addLicenseToInventory();
    },
    hintText: "",
  });

  mother.sprite.setDepth(-2);
  mail.sprite.setDepth(-2);
  mother.sprite.setDepth(-2);
  brother.sprite.setDepth(-2);
  grandpa.sprite.setDepth(-2);
  car_final.sprite.setDepth(-2);

  if (scene.ui) {
    scene.time.delayedCall(1000, () => {
      scene.ui.showMessage(
        "Sua carteira de habilitação acaba de chegar! Interaja com a caixa de correios para pegá-la."
      );
    });
  }

  // === PLAYER ===
  scene.player.setPosition(30, height - 305);
  scene.player.setVelocity(0);

  console.log('Fase 8 iniciada. PlayerState:', scene.playerState);
  console.log('UI disponível:', !!scene.ui);
}

export function updatePhase8(scene) {
  if (scene.playerState.currentArea !== AREAS.finalScene) return;
}