export async function comingSoon(k) {
  let comingSoon = k.add(
    [
      k.text(`COMING SOON!`, {
        size: 24,
        font: "gameboy",
      }),
      k.area(),
      k.anchor("center"),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2, k.height() / 2 - 60)),
      k.z(100),
      "comingSoon",
    ],
    "comingSoon"
  );

  k.wait(5, () => {
    k.destroy(comingSoon);
  });
}

export async function bossLocked(k) {
  let bossLocked = k.add(
    [
      k.text(`DUNGEON IS LOCKED!`, {
        size: 24,
        font: "gameboy",
      }),
      k.area(),
      k.anchor("center"),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2, k.height() / 2 - 60)),
      k.z(100),
      "bossLocked",
    ],
    "bossLocked"
  );

  k.wait(5, () => {
    k.destroy(bossLocked);
  });
}

export async function notEnoughCoins(k) {
  k.destroyAll("notEnoughCoinsContainer");
  k.destroyAll("maxLevelTextContainer");
  k.destroyAll("incompleteMissionContainer");
  k.destroyAll("missionSuccessContainer");

  let notEnoughCoinsContainer = k.add(
    [
      k.text(`Not enough coins!`, {
        size: 24,
        font: "gameboy",
      }),
      k.area(),
      k.anchor("center"),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2, k.height() / 2 - 180)),
      k.z(100),
      "notEnoughCoinsContainer",
    ],
    "notEnoughCoinsContainer"
  );

  k.wait(3, () => {
    k.destroy(notEnoughCoinsContainer);
  });
}

export async function maxLevelText(k, option) {
  k.destroyAll("notEnoughCoinsContainer");
  k.destroyAll("maxLevelTextContainer");
  k.destroyAll("incompleteMissionContainer");
  k.destroyAll("missionSuccessContainer");

  let maxLevelTextContainer = k.add(
    [
      k.text(`You already have max ${option}!`, {
        size: 24,
        font: "gameboy",
      }),
      k.area(),
      k.anchor("center"),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2, k.height() / 2 - 180)),
      k.z(100),
      "maxLevelTextContainer",
    ],
    "maxLevelTextContainer"
  );

  k.wait(3, () => {
    k.destroy(maxLevelTextContainer);
  });
}

export async function incompleteMission(k) {
  k.destroyAll("notEnoughCoinsContainer");
  k.destroyAll("maxLevelTextContainer");
  k.destroyAll("incompleteMissionContainer");
  k.destroyAll("missionSuccessContainer");

  let incompleteMissionContainer = k.add(
    [
      k.text(`The mission is not complete!`, {
        size: 24,
        font: "gameboy",
      }),
      k.area(),
      k.anchor("center"),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2, k.height() / 2 - 180)),
      k.z(100),
      "incompleteMissionContainer",
    ],
    "incompleteMissionContainer"
  );

  k.wait(3, () => {
    k.destroy(incompleteMissionContainer);
  });
}

export async function missionSuccess(k) {
  k.destroyAll("notEnoughCoinsContainer");
  k.destroyAll("maxLevelTextContainer");
  k.destroyAll("incompleteMissionContainer");
  k.destroyAll("missionSuccessContainer");

  let missionSuccessContainer = k.add(
    [
      k.text(`Congrats, Mission completed!`, {
        size: 24,
        font: "gameboy",
      }),
      k.area(),
      k.anchor("center"),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2, k.height() / 2 - 180)),
      k.z(100),
      "missionSuccessContainer",
    ],
    "missionSuccessContainer"
  );

  k.wait(3, () => {
    k.destroy(missionSuccessContainer);
  });
}

export async function gamePausedText(k, option) {
  k.destroyAll("notEnoughCoinsContainer");
  k.destroyAll("maxLevelTextContainer");
  k.destroyAll("incompleteMissionContainer");
  k.destroyAll("missionSuccessContainer");
  k.destroyAll("gamePauseTextContainer");

  if (option) {
    k.add(
      [
        k.text(`PAUSED`, {
          size: 32,
          font: "gameboy",
        }),
        k.area(),
        k.anchor("center"),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2, k.height() / 2)),
        k.z(201),
        "gamePauseTextContainer",
      ],
      "gamePauseTextContainer"
    );
  } else {
    k.destroyAll("gamePauseTextContainer");
  }
}

export async function bossHealth(k, health) {
  k.destroyAll("notEnoughCoinsContainer");
  k.destroyAll("maxLevelTextContainer");
  k.destroyAll("incompleteMissionContainer");
  k.destroyAll("missionSuccessContainer");
  k.destroyAll("gamePauseTextContainer");
  k.destroyAll("bossHealth");

    let healthBossText = k.add(
      [
        k.text(health, {
          size: 32,
          font: "gameboy",
        }),
        k.area(),
        k.anchor("center"),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2, k.height() / 2 - 150)),
        k.z(201),
        "bossHealth",
      ],
      "bossHealth"
    );

    k.wait(3, () => {
      k.destroy(healthBossText);
    });
}
