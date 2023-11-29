import ringsDialogue from "../content/ringsDialogue.js";
import { gameState, playerState } from "../state/stateManagers.js";
import { dialog } from "../uiComponents/dialog.js";
import { playerUnits } from "../uiComponents/playerUnits.js";
import { weapons } from "../uiComponents/weapons.js";
import { onCollideWithPlayer } from "../utils.js";

const directionalStates = ["right", "backtrack", "attack", "evade"];

export function generateGhostComponents(k, pos) {
  return [
    k.sprite("assets", { anim: "ghost-down" }),
    k.area({ shape: new k.Rect(k.vec2(2, 4), 10, 10) }),
    k.body(),
    k.pos(pos),
    k.health(100),
    k.opacity(),
    k.z(2),
    k.scale(1.3),
    k.state("idle", ["idle", ...directionalStates]),
    {
      isAttacking: false,
      attackPower: 2,
      prevPos: k.vec2(0, 0),
    },
    "ghost",
  ];
}

export function setGhostAI(k, ghost, player) {
  const updateRef = k.onUpdate(() => {
    if (player.pos.dist(ghost.pos) < 30) {
      ghost.enterState("backtrack");
      updateRef.cancel();
      return;
    }
  });

  onCollideWithPlayer(k, ghost, 'boss')

  k.loop(5, () => {
    ghost.prevPos = ghost.pos;
  });

  const backtrack = ghost.onStateEnter("backtrack", async () => {
    await k.tween(
      ghost.pos.y,
      ghost.pos.y - 40,
      0.2,
      (val) => (ghost.pos.y = val),
      k.easings.linear
    );

    ghost.enterState("right");
  });

  const right = ghost.onStateEnter("right", async () => {
    await k.tween(
      ghost.pos.x,
      ghost.pos.x + 50,
      1,
      (val) => (ghost.pos.x = val),
      k.easings.linear
    );

    ghost.enterState("attack");
  });

  const attack = ghost.onStateEnter("attack", async () => {
    ghost.isAttacking = true;
    const attackSpeeds = [0.5, 0.8, 1];

    await k.tween(
      ghost.pos,
      player.pos,
      attackSpeeds[Math.floor(Math.random() * attackSpeeds.length)],
      (val) => (ghost.pos = val),
      k.easings.linear
    );

    if (ghost.getCollisions().length > 0) {
      gameState.playSound("bossAttack");
      ghost.enterState("evade");
      return;
    }

    ghost.enterState("attack");
  });

  const evade = ghost.onStateEnter("evade", async () => {
    ghost.isAttacking = false;
    await k.tween(
      ghost.pos,
      ghost.prevPos,
      0.8,
      (val) => (ghost.pos = val),
      k.easings.linear
    );

    ghost.enterState("attack");
  });

  k.onSceneLeave(() => {
    backtrack.cancel();
    right.cancel();
    attack.cancel();
    evade.cancel();
    updateRef.cancel();
  });
}

export function onGhostDestroyed(k) {
  gameState.stopSound("bossAttack");
  k.onDestroy("ghost", () => {
    gameState.stopSound("musicOnBossBattle");
    gameState.playSound("bossDie");
    gameState.stopSound("bossAttack");
    gameState.setFreezePlayer(true);
    playerState.increaseCoinByNum(30)
    gameState.setIsGhostDefeated(true);
    playerUnits(k)
    k.wait(3, () => {
      gameState.playSound("yea");
      gameState.setFreezePlayer(false);

      const prisonKey = k.add([
        k.sprite("assets", { frame: 99 }),
        k.pos(k.center().x + 4, k.center().y - 200),
        k.area(),
        "key",
      ]);

      prisonKey.onCollide("player", () => {
        gameState.playSound('getKey')
        playerState.setHasKey(true), k.destroy(prisonKey);
      });

      const fireRing = k.add([
        k.sprite("fire", { frame: 0 }),
        k.pos(k.center().x - 12, k.center().y - 135),
        k.area(),
        "key",
      ]);

      fireRing.onCollide("player", async () => {
        gameState.setFreezePlayer(true)
        playerState.setNewRing('fireRing')
        gameState.playSound('getWeapon')
        k.destroy(fireRing);
        await dialog(
          k,
          k.vec2(250, 500),
          ringsDialogue[gameState.getLocale()][0]
        );
        k.destroyAll('weaponsContainer');
        weapons(k)
      });
    });
  });
}
