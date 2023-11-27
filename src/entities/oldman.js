import oldManLines from "../content/oldManDialogue.js"
import { gameState, oldManState, playerState } from "../state/stateManagers.js"
import { dialog } from "../uiComponents/dialog.js"
import { weapons } from "../uiComponents/weapons.js"
import { playAnimIfNotPlaying } from "../utils.js"

export function generateOldManComponents(k, pos) {
    return [
        k.sprite('assets', {
            anim: 'oldman-down'
        }),
        k.area({shape: new k.Rect(k.vec2(2, 4), 12, 12)}),
        k.body({ isStatic: true }),
        k.pos(pos),
        "oldman",
    ]
}

export async function startInteraction(k, oldman, player) {
    if(player.direction === 'left') {
        oldman.flipX = true
        playAnimIfNotPlaying(oldman, 'oldman-side')
    }

    if(player.direction === 'right') {
        oldman.flipX = false
        playAnimIfNotPlaying(oldman, 'oldman-side')
    }

    if(player.direction === 'down') {
        playAnimIfNotPlaying(oldman, 'oldman-up')
    }

    if(!playerState.getIsSwordEquipped()) {
        gameState.playSound('getSword')
        playerState.setIsSwordEquipped(true)
        k.destroyAll('weaponsContainer');
        weapons(k)
    }

    const responses = oldManLines[gameState.getLocale()]
    
    if(gameState.getIsSonSaved()) {
        await dialog(k, k.vec2(250, 500), responses[3])
        return
    }

    let numOfTalkedOldMan = oldManState.getNumTalkedOldMan()
    if(numOfTalkedOldMan > responses.length - 2) {
        oldManState.setNumTalkedOldMan(1)
        numOfTalkedOldMan = oldManState.getNumTalkedOldMan()
    }

    if(responses[numOfTalkedOldMan]) {
        await dialog(k, k.vec2(250, 500), responses[numOfTalkedOldMan])
        oldManState.setNumTalkedOldMan(numOfTalkedOldMan + 1)
    }
} 