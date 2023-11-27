import k from './kaboomContext.js'

import world from './scenes/world.js'
import house from './scenes/house.js'
import dungeon from './scenes/dungeon.js'
import mainMenu from './scenes/mainMenu.js'
import options from './scenes/options.js'
import chooseGame from './scenes/chooseGame.js'
import { gameState } from './state/stateManagers.js'

k.loadFont('gameboy', '/gb.ttf')

k.loadSprite('assets', './assets/topdownasset.png', {
    sliceX: 39,
    sliceY: 31,
    anims: {
        // PLAYER ANIMATION
        'player-idle-down': 936,
        'player-down': {
            from: 936,
            to: 939,
            loop: true,
        },
        'player-idle-side': 976,
        'player-side': {
            from: 976,
            to: 978,
            loop: true,
        },
        'player-idle-up': 1014,
        'player-up': {
            from: 1014,
            to: 1017,
            loop: true,
        },
        // SLIME ANIMATION
        'slime-idle-down': 858,
        'slime-down': {
            from: 858,
            to: 859,
            loop: true,
        },
        'slime-idle-side': 860,
        'slime-side': {
            from: 860,
            to: 861,
            loop: true,
        },
        'slime-idle-up': 897,
        'slime-up': {
            from: 897,
            to: 898,
            loop: true,
        },
        // FROG ANIMATION
        'frog-idle-down': 788,
        'frog-down': {
            from: 788,
            to: 789,
            loop: true,
        },
        'frog-idle-side': 790,
        'frog-side': {
            from: 790,
            to: 791,
            loop: true,
        },
        'frog-idle-up': 827,
        'frog-up': {
            from: 827,
            to: 828,
            loop: true,
        },
        // BUNNY ANIMATION
        'bunny-idle-down': 780,
        'bunny-down': {
            from: 780,
            to: 781,
            loop: true,
        },
        'bunny-idle-side': 782,
        'bunny-side': {
            from: 782,
            to: 783,
            loop: true,
        },
        'bunny-idle-up': 819,
        'bunny-up': {
            from: 819,
            to: 820,
            loop: true,
        },
        // GHOST ANIMATION
        'ghost-idle-down': 862,
        'ghost-down': {
            from: 862,
            to: 863,
            loop: true,
        },
        'ghost-idle-side': 864,
        'ghost-side': {
            from: 864,
            to: 865,
            loop: true,
        },
        'ghost-idle-up': 901,
        'ghost-up': {
            from: 901,
            to: 902,
            loop: true,
        },
        // OLD MAN IN HOUSE ANIMATION
        'oldman-down': 866,
        'oldman-side': 907,
        'oldman-up': 905,
        // PLAYER SWORD ATTACK ANIMATION
        'player-attack-up': 1094,
        'player-attack-down': 1092,
        'player-attack-left': 1093,
        'player-attack-right': 1093,
        // GHOST BOSS ANIMATION
        'ghost-down': { from: 862, to: 863, loop: true},
        // COIN ANIMATION
        'coin-anim': {
            from: 969,
            to: 974,
            loop: true,
        },

    }
})
// HEALTH BAR ASSETS
k.loadSpriteAtlas("./assets/topdownasset.png", {
    'full-heart': {
        x: 0,
        y: 224,
        width: 48,
        height: 48
    },
    'half-heart': {
        x: 48,
        y: 224,
        width: 48,
        height: 48
    },
    'empty-heart': {
        x: 96,
        y: 224,
        width: 48,
        height: 48
    },
})

k.loadSprite('playerImg', '../../assets/images/playerImg.png')
k.loadSprite('bunny', '../../assets/images/bunny.png')
k.loadSprite('frog', '../../assets/images/frog.png')
k.loadSprite('ghost', '../../assets/images/ghost.png')
k.loadSprite('seller', '../../assets/images/sellerPerson.png')
k.loadSprite('slime', '../../assets/images/slime.png')
k.loadSprite('mission', '../../assets/images/missionPerson.png')
k.loadSprite('logo', '../../assets/images/logo.png')
k.loadSprite('logo2', '../../assets/images/logo2.png')
k.loadSprite('loadingScreen', '../../assets/images/kabuLoadingScreen.png')

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