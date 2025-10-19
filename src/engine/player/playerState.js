import { AREAS } from "../../core/config";

export function createPlayerState() {
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
  };
}
