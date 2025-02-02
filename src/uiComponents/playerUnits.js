import { gameState, playerState } from "../state/stateManagers.js";

export async function playerUnits(k, player) {
  backgroundUnits(k)
  armor(k);
  coins(k);
  enemiesKilled(k);
  attackPowerUnit(k);
  healthPercentage(k, player);
  speed(k);
}

function armor(k) {
  k.destroyAll("armorContainer");
  const currArmor = playerState.getArmor();
  let text =
    currArmor == 1
      ? "STANDART"
      : currArmor == 2
      ? "MEDIUM"
      : currArmor == 3
      ? "STRONG"
      : "MAX";

  k.add([
    k.text(`ARMOR: ${text}`, {
      size: 16,
      font: "gameboy",
    }),
    k.fixed(),
    k.pos(20, k.height() - 80),

    "armorContainer",
  ]);
}

function speed(k) {
  k.destroyAll("speedContainer");
  const currSpeed = playerState.getSpeed();
  let text =
    currSpeed == 0
      ? "STANDART"
      : currSpeed == 10
      ? "FAST"
      : currSpeed == 20
      ? "VERY FAST"
      : "MAX";

  k.add([
    k.text(`SPEED: ${text}`, {
      size: 16,
      font: "gameboy",
    }),
    k.fixed(),
    k.pos(20, k.height() - 110),

    "speedContainer",
  ]);
}

function healthPercentage(k, player) {
  k.destroyAll("healthPercentage");
  let mute = gameState.getIsMuted()
  const currHealth = playerState.getHealth();
  const maxHealth = playerState.getMaxHealth();
  let healthPerc = (currHealth * 100) / maxHealth;
  let heartbeatSound = gameState.getSound("heartbeat");
  let fear = gameState.getSound("fear");

  if (healthPerc <= 15) {
    if (player) {
      player.speed = 40;
      k.camScale(5);
    }
    if (!fear.playing() && !mute) {
      fear.play();
    }
    if (!heartbeatSound.playing() && !mute) {
      heartbeatSound.play();
    }
  } else {
    if (heartbeatSound.playing()) {
      if (player) {
        k.camScale(4);
        player.speed = 60 + playerState.getSpeed();
      }
      heartbeatSound.stop();
    }
    if (fear.playing()) {
      fear.stop();
    }
  }
  k.add([
    k.text(`HEALTH: ${healthPerc.toFixed(2)}%`, {
      size: 16,
      font: "gameboy",
    }),
    k.fixed(),
    k.pos(20, k.height() - 138),
    "healthPercentage",
  ]);
}

function coins(k) {
  k.destroyAll("coinsContainer");
  const coins = playerState.getCoins();

  k.add([
    k.sprite("assets", {
      width: 50,
      height: 50,
      frame: 969,
      anim: 'coin-anim',
    }),
    k.pos(0, k.height() - 215),
    k.fixed(),
    "coinsContainer",
  ]);

  k.add([
    k.text(coins, {
      size: 16,
      font: "gameboy",
    }),
    k.pos(45, k.height() - 199),
    k.fixed(),
    "coinsContainer",
  ]);
}

function enemiesKilled(k) {
  k.destroyAll("enemiesKilledCount");
  const enemiesKilled = playerState.getEnemiesKilled();

  k.add(
    [
      k.text(`Enemies: ${enemiesKilled}`, { size: 16, font: "gameboy" }),
      k.area(),
      k.anchor("topright"),
      k.fixed(),
      k.pos(k.width() - 40, 20),
      "enemiesKilledCount",
    ],
    "enemiesKilledCount"
  );
}

export function currMission(k) {
  k.destroyAll("currMissionUnits");
  const mission = gameState.getCurrMission();
  let option = false;
  let bossDie;
  let prisonFree;
  let text = `${mission.name}  ${mission.currNum} / ${mission.goal}`;

  if (mission.name === "boss") {
    option = true;
    bossDie = gameState.getIsGhostDefeated();
    prisonFree = gameState.getIsSonSaved();
    text = `${mission.name}  ${bossDie ? 1 : 0} / ${mission.goal}\nprison  ${
      prisonFree ? 1 : 0
    } / 1`;
  }

  let missionContainer = k.add(
    [
      k.text(text, { size: 24, font: "gameboy" }),
      k.area(),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2 - 100, k.height() - (option ? 100 : 50))),
      "currMissionUnits",
    ],
    "currMissionUnits"
  );

  k.wait(1.5, () => {
    k.destroy(missionContainer);
  });
}

function attackPowerUnit(k) {
  k.destroyAll("attackPowerUnit");
  const enemiesKilled = playerState.getEnemiesKilled();
  const attackLevel = playerState.getAttackLevel();
  let attackPowerNum = 1;
  let criticalChange = 95;

  if (enemiesKilled >= 1000) {
    if (attackLevel == 3) {
      attackLevelUp(k);
      playerState.setNewAttackLevel(4);
      gameState.playSound("levelUp");
    }
    attackPowerNum = 3;
    criticalChange = 70;
  } else if (enemiesKilled >= 500) {
    if (attackLevel == 2) {
      attackLevelUp(k);
      playerState.setNewAttackLevel(3);
      gameState.playSound("levelUp");
    }
    attackPowerNum = 2.5;
    criticalChange = 80;
  } else if (enemiesKilled >= 250) {
    if (attackLevel == 1) {
      attackLevelUp(k);
      playerState.setNewAttackLevel(2);
      gameState.playSound("levelUp");
    }
    attackPowerNum = 2;
    criticalChange = 85;
  } else if (enemiesKilled >= 100) {
    if (attackLevel == 0) {
      attackLevelUp(k);
      playerState.setNewAttackLevel(1);
      gameState.playSound("levelUp");
    }
    attackPowerNum = 1.5;
    criticalChange = 90;
  }

  k.add([
    k.text(`ATTACK: ${attackPowerNum}`, {
      size: 16,
      font: "gameboy",
    }),
    k.pos(20, k.height() - 50),
    k.fixed(),
    "attackPowerUnit",
  ]);

  k.add([
    k.text(`CRITICAL CHANCE: ${100 - criticalChange}%`, {
      size: 16,
      font: "gameboy",
    }),
    k.pos(20, k.height() - 25),
    k.fixed(),
    "attackPowerUnit",
  ]);
}

function attackLevelUp(k) {
  let attackLevelUp = k.add(
    [
      k.text(`ATTACK POWER LEVEL UP`, {
        size: 24,
        font: "gameboy",
      }),
      k.area(),
      k.anchor("center"),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2, k.height() / 2 - 60)),
      k.z(100),
      "attackLevelUp",
    ],
    "attackLevelUp"
  );

  k.wait(5, () => {
    k.destroy(attackLevelUp);
  });
}

export function sideSlots(k) {
  k.destroyAll("sideSlotsContainer");

  k.add([
    k.sprite("sideSlots", {
      width: 60,
      height: 220
    }),
    k.anchor('topleft'),
    k.opacity(0.9),
    k.fixed(),
    k.pos(0, k.height() / 3),
  ], 'sideSlotsContainer');
}

function backgroundUnits(k) {
  k.destroyAll("backgroundUnits");

  k.add([
    k.sprite("backgroundUnitsImg", {
      width: 360,
      height: 170,
    }),
    k.pos(0, k.height() - 160),
    k.fixed(),
    k.opacity(0.8),
    "backgroundUnits",
  ]);
}
