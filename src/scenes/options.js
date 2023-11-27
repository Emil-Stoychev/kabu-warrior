import optionsText from "../content/optionsText.js";
import { gameState } from "../state/stateManagers.js";
import { colorizeBackground } from "../utils.js";

export default async function options(k) {
  const currentLocale = gameState.getLocale();
  colorizeBackground(k, 37, 42, 52);

  k.onKeyPress((key) => {
    if (key === "m" || key === "м") {
      gameState.setMute();
    }
  });

  template(k, currentLocale);
}

function template(k, currentLocale) {
  let index = 0;

  k.add([
    k.sprite("logo2", {
      width: 130,
      height: 130,
    }),
    k.fixed(),
    k.pos(20, 20),
  ]);

  k.add([
    k.sprite("logo2", {
      width: 130,
      height: 130,
    }),
    k.anchor("topright"),
    k.fixed(),
    k.pos(k.width() - 20, 20),
  ]);

  let left = k.add([
    k.text(optionsText[currentLocale].prev, { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.fixed(),
    k.pos(120, 380),
  ]);

  let right = k.add([
    k.text(optionsText[currentLocale].next, { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.fixed(),
    k.pos(k.width() / 2 + 500, 400),
  ]);

  k.add([
    k.text(optionsText[currentLocale].title, { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 270),
  ]);

  //   BACK BUTTON
  let back = k.add([
    k.text(optionsText[currentLocale].back, { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 300),
  ]);

  left.onClick(() => {
    gameState.playSound("tap");
    index--;
    if (index < 1) {
      k.destroyAll("playerItem");
      k.destroyAll("enemiesItem");
      index = 0;
      getPlayerInfo(k, currentLocale);
    }

    if (index >= 1) {
      k.destroyAll("playerItem");
      k.destroyAll("enemiesItem");
      getEnemiesInfo(k, currentLocale, index);
    }
  });

  right.onClick(() => {
    gameState.playSound("tap");
    index++;
    if (index >= 6) {
      index = 6;
    }

    if (index >= 1) {
      k.destroyAll("playerItem");
      k.destroyAll("enemiesItem");
      getEnemiesInfo(k, currentLocale, index);
    }
  });

  back.onClick(() => {
    gameState.playSound("tap");
    k.go("mainMenu");
  });

  if (index === 0) {
    k.destroyAll("playerItem");
    k.destroyAll("enemiesItem");
    getPlayerInfo(k, currentLocale);
  }
}

function getPlayerInfo(k, currentLocale) {
  k.destroyAll("enemiesItem");

  k.add([
    k.sprite("playerImg", {
      width: 150,
      height: 150,
    }),
    k.anchor("topright"),
    k.fixed(),
    k.pos(k.center().x - 150, k.center().y + 30),
    "playerItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].main.playerMovement, {
      size: 24,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 150),
    "playerItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].main.missionInfo, {
      size: 24,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 100),
    "playerItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].main.sword, {
      size: 24,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 50),
    "playerItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].main.sword, {
      size: 24,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 50),
    "playerItem",
  ]);

  //   PLAYER INFO
  k.add([
    k.text(optionsText[currentLocale].playerInfo.name, {
      size: 20,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 30),
    "playerItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].playerInfo.health, {
      size: 20,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 70),
    "playerItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].playerInfo.speed, {
      size: 20,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x - 10, k.center().y + 110),
    "playerItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].playerInfo.attack, {
      size: 20,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x - 10, k.center().y + 150),
    "playerItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].playerInfo.criticalChance, {
      size: 20,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x + 80, k.center().y + 190),
    "playerItem",
  ]);
}

function getEnemiesInfo(k, currentLocale, i) {
  if (i > 7) {
    i = 6;
  }
  let text =
    i == 1
      ? "slime"
      : i == 2
      ? "frog"
      : i == 3
      ? "bunny"
      : i == 4
      ? "ghost"
      : i == 5
      ? "seller"
      : i == 6
      ? "mission"
      : "";

  k.add([
    k.sprite(text, {
      width: 140,
      height: 140,
    }),
    k.anchor("center"),
    k.fixed(),
    k.pos(630, 250),
    "enemiesItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].enemies?.[text].name, {
      size: 22,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 20),
    "enemiesItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].enemies?.[text]?.health, {
      size: 22,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 20),
    "enemiesItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].enemies?.[text]?.speed, {
      size: 22,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x - 10, k.center().y + 60),
    "enemiesItem",
  ]);

  k.add([
    k.text(optionsText[currentLocale].enemies?.[text]?.attack, {
      size: 22,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x - 10, k.center().y + 100),
    "enemiesItem",
  ]);

  if (optionsText[currentLocale].enemies?.[text]?.poison) {
    k.add([
      k.text(optionsText[currentLocale].enemies?.[text]?.poison, {
        size: 22,
        font: "gameboy",
      }),
      k.area(),
      k.anchor("center"),
      k.pos(k.center().x + (text == "mission" ? 15 : 62), k.center().y + 140),
      "enemiesItem",
    ]);
  }
}
