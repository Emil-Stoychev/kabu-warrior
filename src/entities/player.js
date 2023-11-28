import { gameState, playerState } from "../state/stateManagers.js"
import { playAnimIfNotPlaying } from "../utils.js"

export function generatePlayerComponents(k, pos) {
    return [
        k.sprite('assets', {
            anim: 'player-idle-down'
        }),
        k.area({shape: new k.Rect(k.vec2(3, 4), 10, 12)}),
        k.body(),
        k.pos(pos),
        k.opacity(),
        k.z(2),
        {
            speed: 60,
            attackPower: 1,
            direction: 'down',
            isAttacking: false,
        },
        "player",
    ]

    // k.get("player") with that i can get current object by name
}

export function setPlayerMovement(k, player) {
    if(!player?.speed) return
    k.onKeyDown((key) => {
            if(gameState.getFreezePlayer()) return
            let speed = playerState.getSpeed()
            
            playerMovementLogic(k, player, key, 'left', ['up', 'down', 'w', 's', 'a'], 'left', k.vec2(-player.speed - speed, 0))
            playerMovementLogic(k, player, key, 'a', ['up', 'down', 'w', 's', 'left'], 'left', k.vec2(-player.speed - speed, 0))

            playerMovementLogic(k, player, key, 'right', ['up', 'down', 'w', 's', 'd'], 'right', k.vec2(player.speed + speed, 0))
            playerMovementLogic(k, player, key, 'd', ['up', 'down', 'w', 's', 'right'], 'right', k.vec2(player.speed + speed, 0))

            playerMovementLogic(k, player, key, 'up', ['w'], 'up', k.vec2(0, -player.speed - speed))
            playerMovementLogic(k, player, key, 'w', ['up'], 'up', k.vec2(0, -player.speed - speed))

            playerMovementLogic(k, player, key, 'down', ['s'], 'down', k.vec2(0, player.speed + speed))
            playerMovementLogic(k, player, key, 's', ['down'], 'down', k.vec2(0, player.speed + speed))
    })

    k.onKeyPress((key) => {
        if(key !== 'space') return
        if(player.isAttacking) return
        if(gameState.getFreezePlayer()) return
        if(!playerState.getIsSwordEquipped()) return

        player.isAttacking = true

        if(k.get('swordHitBox').length === 0) {
            const swordHitBoxPosX = {
                left: player.worldPos().x - 6,
                right: player.worldPos().x + 10,
                up: player.worldPos().x + 2,
                down: player.worldPos().x + 2,
            }

            const swordHitBoxPosY = {
                left: player.worldPos().y + 5,
                right: player.worldPos().y + 5,
                up: player.worldPos().y - 3,
                down: player.worldPos().y + 11,
            }

            gameState.playSound('sword')

            k.add([
                k.area({ shape: new k.Rect(k.vec2(0), 12, 12)}),
                k.pos(
                    swordHitBoxPosX[player.direction],
                    swordHitBoxPosY[player.direction],
                ),
                'swordHitBox'
            ])

            k.wait(0.5, () => {
                k.destroyAll('swordHitBox')
                if(
                    player.direction === 'left' ||
                    player.direction === 'right'
                ) {
                    playAnimIfNotPlaying(player, 'player-side')
                    player.stop()
                    return
                }
                playAnimIfNotPlaying(player, `player-${player.direction}`)
                player.isAttacking = false
                player.stop()
            })
        }
        playAnimIfNotPlaying(player, `player-attack-${player.direction}`)
    })

    k.onKeyRelease(() => {
        gameState.stopSound('playerWalk')
        player.isAttacking = false
        player.stop()
    })
}

export function areAnyOfTheseKeysDown(k, keys) {
    for(const key of keys) {
        if(k.isKeyDown(key)) return true
    }

    return false
}


// KEYS PRESS

function playerMovementLogic(k, player, currentKey, expectedKey, excludedKeys, direction, moveVec2) {
    if(currentKey === expectedKey && !areAnyOfTheseKeysDown(k, excludedKeys)) {
        gameState.playSound('playerWalk')

        switch(direction) {
            case 'left':
                player.flipX = true
                playAnimIfNotPlaying(player, 'player-side')
                break;
            case 'right':
                player.flipX = false
                playAnimIfNotPlaying(player, 'player-side')
                break;
            case 'up':
                playAnimIfNotPlaying(player, 'player-up')
                break;
            case 'down':
                playAnimIfNotPlaying(player, 'player-down')
                break;    
        }

        player.move(moveVec2)
        player.direction = direction
        return;
    }
}