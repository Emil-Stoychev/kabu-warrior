import world from "./scenes/world.js";
import { playerState, oldManState, gameState } from "./state/stateManagers.js";

import { showDamage } from "./uiComponents/damage.js";
import { healthBar } from "./uiComponents/healthBar.js";
import { playerUnits } from "./uiComponents/playerUnits.js";

export async function fetchMapData(mapPath) {
  return await (await fetch(mapPath)).json();
}

export function drawTiles(k, map, layer, tileheight, tilewidth) {
  let numOfDrawnTiles = 0;
  const tilePos = k.vec2(0, 0);

  for (const tile of layer?.data) {
    if (numOfDrawnTiles % layer.width === 0) {
      tilePos.x = 0;
      tilePos.y += tileheight;
    } else {
      tilePos.x += tilewidth;
    }

    numOfDrawnTiles++;
    if (tile === 0 || tile > 1209) continue;

    map.add([
      k.sprite("assets", { frame: tile - 1 }),
      k.pos(tilePos),
      k.z(layer.name === 'Upmost' && 3),
      k.offscreen(),
    ]);
  }
}

export function colorizeBackground(k, r, g, b) {
  k.add([k.rect(k.canvas.width, k.canvas.height), k.color(r, g, b), k.fixed()]);
}

export function generateColliderBoxComponents(k, width, height, pos, tag) {
  return [
    k.area({ shape: new k.Rect(k.vec2(0), width, height) }),
    k.pos(pos),
    k.body({ isStatic: true }),
    k.offscreen(),
    tag,
  ];
}

export function drawBoundaries(k, map, layer) {
  for (const object of layer.objects) {
    map.add(
      generateColliderBoxComponents(
        k,
        object.width,
        object.height,
        k.vec2(object.x, object.y + 16),
        object.name,
      )
    );
  }
}

export function playAnimIfNotPlaying(gameObj, animName) {
    if(gameObj.curAnim() !== animName) gameObj.play(animName)
}


export async function blinkEffect(k, entity) {
  await k.tween(
    entity.opacity,
    0,
    0.1,
    (val) => (entity.opacity = val),
    k.easings.linear
  )
  await k.tween(
    entity.opacity,
    1,
    0.1,
    (val) => (entity.opacity = val),
    k.easings.linear
  )
}

export function onAttacked(k, entity, player, enemyName) {
  entity.onCollide('swordHitBox',async () => {
    if(entity.isAttacking) return
    let criticalDamage = Math.floor(Math.random() * 100)
    await blinkEffect(k, entity)
    let enemiesKilledByPlayer = playerState.getEnemiesKilled()
    let multiply = 1
    let criticalWall = 95

    if (enemiesKilledByPlayer >= 1000) {
      multiply = 3
      criticalWall = 70
    } else if (enemiesKilledByPlayer >= 500) {
      multiply = 2.5
      criticalWall = 80
    } else if (enemiesKilledByPlayer >= 250) {
      multiply = 2
      criticalWall = 85
    } else if (enemiesKilledByPlayer >= 100) {
      multiply = 1.5
      criticalWall = 90
    }

    let numOfDamage = criticalDamage >= criticalWall ? (Math.floor(Math.random() * 9) + 2) : player.attackPower * multiply

    showDamage(k, numOfDamage)
    entity.hurt(numOfDamage)

    if(entity.hp() <= 0) {
      let currMission = gameState.getCurrMission()
      if(currMission && currMission.name === enemyName) {
        gameState.completeMissionIfItIsReady()
      }

      const coin = k.add([
        k.sprite("assets", {
          frame: 969,
          anim: 'coin-anim',
        }),
        k.pos(entity.pos.x, entity.pos.y),
        k.area(),
        "key",
      ]);

      coin.onCollide("player", () => {
        gameState.playSound('getCoin')
        playerState.increaseCoinByOne()
        playerUnits(k, player)
        k.destroy(coin);
      });

      gameState.playSound('entityDie')
      k.destroy(entity)
      playerState.increaseEnemiesKilled()
      playerUnits(k, player)
      return
    }
  })
}

export function onCollideWithPlayer(k, entity, enemyName) {
  entity.onCollide('player',async (player) => {
    if(entity.isAttacking) return
    let armor = playerState.getArmor()
    if(enemyName === 'frog' && player.speed >= 60) {
      countdownTimer(k, 1.30)
      let oldSpeed = player.speed
      player.speed = 20

      k.wait(3, () => {
        player.speed = oldSpeed
      })
    }
    playerState.setHealth(playerState.getHealth() - (playerState.getIsShieldEquipped() ? entity.attackPower / 2 : entity.attackPower))
    gameState.playSound('playerHurt')
    showDamage(k, (playerState.getIsShieldEquipped() ? entity.attackPower / 2 : entity.attackPower) / armor, true)
    k.destroyAll('heartsContainer')
    playerUnits(k, player)
    healthBar(k, player)
    await blinkEffect(k, player)
    if(playerState.getHealth() <= 0) {
      gameState.playSound('gameOver')
      playerState.resetPlayerStatus()
      gameState.resetGameStatus()
      k.destroyAll('weaponsContainer')
      playerUnits(k, player)
      oldManState.setNumTalkedOldMan(0)
      k.go('world')
    }
  })
}

export async function onFireCollideWithPlayer(k, player) {
      playerState.setHealth(playerState.getHealth() - (playerState.getIsShieldEquipped() ? 0.5 / 2 : 0.5))
      let armor = playerState.getArmor()
      k.destroyAll('heartsContainer')
      gameState.playSound('playerHurt')
      showDamage(k, (playerState.getIsShieldEquipped() ? 0.5 / 2 : 0.5) / armor, true)
      healthBar(k, player)
      playerUnits(k, player)
      await blinkEffect(k, player)
      if(playerState.getHealth() <= 0) {
        gameState.playSound('gameOver')
        playerState.resetPlayerStatus()
        gameState.resetGameStatus()
        k.destroyAll('weaponsContainer')
        playerUnits(k, player)
        oldManState.setNumTalkedOldMan(0)
        k.go('world')
      }
}



// CAMERA SLIDE SLOW TO ANOTHER POSITION
export async function slideCamY(k, range, duration) {
  const currentCamPos = k.camPos()
  await k.tween(
    currentCamPos.y,
    currentCamPos.y + range,
    duration,
    (newPosY) => k.camPos(currentCamPos.x, newPosY),
    k.easings.linear
  )
}

export async function generateWorld(k, num) {
  world(k, num)
}

export async function countdownTimer(k, timerValue) {
  k.destroyAll('timerText');

  const timerText = k.add([
    k.text(timerValue.toFixed(2), {
      size: 32
    }),
    k.pos(k.width() / 2, k.height() - 120),
    k.fixed(),
  ], 'timerText');

  while (timerValue > 0) {
    timerText.text = timerValue.toFixed(2);
    let scaleMultiplier = 1;
    if (timerValue <= 0.3) {
      scaleMultiplier = Math.max(timerValue / 0.3);
    }
    timerText.scale = k.vec2(scaleMultiplier, scaleMultiplier);
    await k.wait(0.01);
    timerValue -= 0.01;
  }
  k.destroy(timerText);
}