export function createPlayerState() {
  return {
    canMove: true,
    inDialog: false,
    inMiniGame: false,
    transitioning: false,
    transitionCooldown: false,

    // ÁREA atual do mundo
    currentArea: 'home',

    // Missões (Fase 1)
    hasMission: false,
    docsMissionCompleted: false,
    collectedDocs: [],

    // Missões (Fase 2)
    phase2Completed: false,
  };
}
