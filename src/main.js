import k from './kaboomContext.js'

import world from './scenes/world.js'
import house from './scenes/house.js'
import dungeon from './scenes/dungeon.js'
import mainMenu from './scenes/mainMenu.js'
import options from './scenes/options.js'
import chooseGame from './scenes/chooseGame.js'
import { gameState } from './state/stateManagers.js'
import loadSprites from './sprites.js'

loadSprites(k)

const scenes = {
    world,
    house,
    dungeon,
    mainMenu,
    options,
    chooseGame,
}

Object.entries(scenes).forEach(([sceneName, sceneFunction]) => {
    k.scene(sceneName, async () => {
        gameState.playSound('portalStart')
        k.add([k.sprite("loadingScreen"), k.pos(0, -60)]);

        await sceneFunction(k);

        k.destroyAll('loadingScreen')
    });
});

k.go("mainMenu")