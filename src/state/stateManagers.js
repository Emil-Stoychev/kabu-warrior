import globalStateManager from "./globalState.js";
import oldManGlobalStateManager from "./oldManGlobalState.js";
import playerGlobalStateManager from "./playetGlobalState.js";

export const gameState = globalStateManager().getInstance()
export const oldManState = oldManGlobalStateManager().getInstance()
export const playerState = playerGlobalStateManager().getInstance()

