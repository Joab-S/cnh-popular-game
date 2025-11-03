import { AREAS } from "../../core/config";

let playerState = null;

function getDefaultState() {
  return {
    canMove: true,
    inDialog: false,
    inMiniGame: false,
    transitioning: false,
    transitionCooldown: false,

    // ÁREA atual do mundo
    currentArea: AREAS.home,
    
    // Se já está em alguma missão, não poderá iniciar outra
    hasMission: false,

    // Missões (Fase 1)
    docsMissionCompleted: false,
    collectedDocs: [],

    // Missões (Fase 2)
    phase2Completed: false,
    quizActive: false,
    
    miniGameActive: false,
    
    phase3Completed: false,
    phase4Completed: false,
    phase5Completed: false,
    phase6Completed: false,
    phase7Completed: false,
    phase8Completed: false,

    hasLicense: false,
    selectedCharacter: null,
    texture: null,
  };
}

export function createPlayerState() {
  if (playerState) return playerState;

  const base = getDefaultState();

  const proxy = new Proxy(base, {
    set(target, key, value) {
      target[key] = value;
      return true;
    },
    get(target, key) {
      return target[key];
    }
  });

  playerState = proxy;
  return proxy;

}

export function getPlayerStateInstance() {
  return playerState;
}

export function resetPlayerState() {
  if (!playerState) return;
  Object.assign(playerState, getDefaultState());
}
