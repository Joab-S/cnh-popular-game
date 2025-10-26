export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;
export const WORLD_SIZE = GAME_WIDTH * 1.5;
export const AREAS = {
  home: 'home',                           // Jogador começa em casa, faz a inscrição dele no programa e coleta os documentos necessários
  city: 'city',                           // Jogador sai de casa e vai para a cidade, lá ele faça com o agente do detran para ter o direcionamento dos próximos passos
  clinic: 'clinic',                       // Jogador vai para a clinica, onde presta o exame Psicotécnico ou apenas é instruído sobre o assunto e direcionado para a próxima etapa.
  drivingSchool1: 'driving-school-1',     // O jogador terá as aulas teóricas na autoescola, cumprindo X horas (deve ser informado sobre o processo)
  theoreticalTest: 'theoretical-test',    // Após as aulas, o jogador é levado para o exame prático, onde ocorrerá o minigame da fase teórica.
  drivingSchool2: 'driving-school-2',     // Após aprovação no exame teórico, da-se início as aulas praticas
  practicalTest: 'practical-test',        // Então o jogador é direcioado ao minigame do exame prático
  finalScene: 'final-scene'               // Após a aprovação, o jogador recebe sua PPD, e poderá desfrutar de digigir pela cidade.
};
export const PHYSICS_DEBUG = true;

export const GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0e0e0e',
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: PHYSICS_DEBUG, // ative para visualizar hitboxes
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
