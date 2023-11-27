import { gameState } from "../state/stateManagers.js";
import { playAnimIfNotPlaying } from "../utils.js";

const directionalStates = ["left", "right", "up", "down"];

export function generateSlimeComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "slime-idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 6), 16, 10) }),
    k.body(),
    k.pos(pos),
    k.offscreen(),
    k.opacity(),
    k.state("idle", ["idle", ...directionalStates]),
    k.health(5),
    {
      speed: 30,
      attackPower: 0.5,
    },
    "slime",
  ];

  // k.get("slime") with that i can get current object by name
}

export function generateFrogComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "frog-idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 6), 16, 10) }),
    k.body(),
    k.pos(pos),
    k.offscreen(),
    k.opacity(),
    k.state("idle", ["idle", ...directionalStates]),
    k.health(10),
    {
      speed: 15,
      attackPower: 2,
    },
    "frog",
  ];
}

export function generateBunnyComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "bunny-idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 6), 16, 10) }),
    k.body(),
    k.pos(pos),
    k.offscreen(),
    k.opacity(),
    k.state("idle", ["idle", ...directionalStates]),
    k.health(7),
    {
      speed: 50,
      attackPower: 1,
    },
    "bunny",
  ];
}

export function generateGhostComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "ghost-idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 6), 16, 10) }),
    k.body(),
    k.pos(pos),
    k.offscreen(),
    k.opacity(),
    k.state("idle", ["idle", ...directionalStates]),
    k.health(12),
    {
      speed: 30,
      attackPower: 1.5,
    },
    "ghost",
  ];
}

export function setEnemyAI(k, enemy, option, player) {
  k.onUpdate(() => {
    switch (enemy.state) {
      case "right":
        if (gameState.getIsGamePaused()) return;
        return enemy.move(enemy.speed, 0);
      case "left":
        if (gameState.getIsGamePaused()) return;
        return enemy.move(-enemy.speed, 0);
      case "up":
        if (gameState.getIsGamePaused()) return;
        return enemy.move(0, -enemy.speed);
      case "down":
        if (gameState.getIsGamePaused()) return;
        return enemy.move(0, enemy.speed);
      default:
    }
  });

  const idle = enemy.onStateEnter("idle", async () => {
    enemy.stop();
    await k.wait(Math.floor(Math.random() * 3));
    enemy.enterState(
      directionalStates[Math.floor(Math.random() * directionalStates.length)]
    );
  });
  const right = enemy.onStateEnter("right", async () => {
    enemy.flipX = false;
    const updateRef = k.onUpdate(() => {
      if (player.pos.dist(enemy.pos) < 50) {
        if (option === "slime") gameState.playSound("slimeSound");
        if (option === "frog") gameState.playSound("frogSound");
        if (option === "bunny") gameState.playSound("bunnySound");
        if (option === "ghost") gameState.playSound("ghostSound");
        updateRef.cancel();
        return;
      }
    });
    playAnimIfNotPlaying(enemy, `${option}-side`);
    await k.wait(3);
    enemy.enterState("idle");
  });
  const left = enemy.onStateEnter("left", async () => {
    enemy.flipX = true;
    const updateRef = k.onUpdate(() => {
      if (player.pos.dist(enemy.pos) < 50) {
        if (option === "slime") gameState.playSound("slimeSound");
        if (option === "frog") gameState.playSound("frogSound");
        if (option === "bunny") gameState.playSound("bunnySound");
        if (option === "ghost") gameState.playSound("ghostSound");
        updateRef.cancel();
        return;
      }
    });
    playAnimIfNotPlaying(enemy, `${option}-side`);
    await k.wait(3);
    enemy.enterState("idle");
  });
  const down = enemy.onStateEnter("down", async () => {
    playAnimIfNotPlaying(enemy, `${option}-down`);
    const updateRef = k.onUpdate(() => {
      if (player.pos.dist(enemy.pos) < 50) {
        if (option === "slime") gameState.playSound("slimeSound");
        if (option === "frog") gameState.playSound("frogSound");
        if (option === "bunny") gameState.playSound("bunnySound");
        if (option === "ghost") gameState.playSound("ghostSound");
        updateRef.cancel();
        return;
      }
    });
    await k.wait(3);
    enemy.enterState("idle");
  });
  const up = enemy.onStateEnter("up", async () => {
    playAnimIfNotPlaying(enemy, `${option}-up`);
    const updateRef = k.onUpdate(() => {
      if (player.pos.dist(enemy.pos) < 50) {
        if (option === "slime") gameState.playSound("slimeSound");
        if (option === "frog") gameState.playSound("frogSound");
        if (option === "bunny") gameState.playSound("bunnySound");
        if (option === "ghost") gameState.playSound("ghostSound");
        updateRef.cancel();
        return;
      }
    });
    await k.wait(3);
    enemy.enterState("idle");
  });

  k.onSceneLeave(() => {
    idle.cancel();
    right.cancel();
    left.cancel();
    down.cancel();
    up.cancel();
  });
}
