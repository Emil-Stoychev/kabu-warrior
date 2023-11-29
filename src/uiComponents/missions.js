import { gameState } from "../state/stateManagers.js";
import { dialog } from "./dialog.js";

let firstMissionDialog = {
  EN: [
    "Hey, good luck with the missions and the path to the boss!",
    "Press I to see mission info",
  ],
  BG: [
    "Хей, късмет с мисиите и пътят до главната цел!",
    "Натисни I (И), за да видиш информация за мисията",
  ],
};

export async function missions(k) {
  let currMission = gameState.getCurrMission();
  let items = [];

  let missionContainer = k.add([
    k.rect(800, 300),
    k.color(100, 100, 100),
    k.fixed(),
    k.pos(k.vec2(k.width() / 2 - 400, k.height() / 2 - 150)),
    "missionContainer",
  ]);

  const createItem = (data) => {
    // ADD SWORD IMAGE FOR MORE USER FRIENDLY EXP
    let sword = k.add(
      [
        k.sprite("assets", {
          frame: 180,
          width: 50,
          height: 50,
        }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 - 390, k.height() / 2 - 140)), // Centered position
        k.z(100),
        "item",
      ],
      "missionContainer"
    );

    let sword1 = k.add(
      [
        k.sprite("assets", {
          frame: 180,
          width: 50,
          height: 50,
          flipX: true,
        }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 - 380, k.height() / 2 - 140)), // Centered position
        k.z(100),
        "item",
      ],
      "missionContainer"
    );

    let sword2 = k.add(
      [
        k.sprite("assets", {
          frame: 180,
          width: 50,
          height: 50,
        }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 + 330, k.height() / 2 - 140)), // Centered position
        k.z(100),
        "item",
      ],
      "missionContainer"
    );

    let sword3 = k.add(
      [
        k.sprite("assets", {
          frame: 180,
          width: 50,
          height: 50,
          flipX: true,
        }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 + 340, k.height() / 2 - 140)), // Centered position
        k.z(100),
        "item",
      ],
      "missionContainer"
    );

    // CENTER TOP TEXT MISSION
    let centerTextMission = k.add(
      [
        k.text("MISSIONS", {
          size: 24,
          font: "gameboy",
        }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 - 70, k.height() / 2 - 120)), // Centered position
        k.z(100),
      ],
      "missionContainer"
    );

    // CURRENT MISSION
    const collect = k.add(
      [
        k.sprite("assets", {
          frame: 969,
          width: 100,
          height: 100,
        }),
        k.area({ shape: new k.Rect(k.vec2(3, 4), 100, 100) }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 + 240, k.height() / 2 - 60)), // Centered position
        k.z(100),
        "collect",
      ],
      "missionContainer"
    );

    let text = k.add(
      [
        k.text(data.text, {
          size: 20,
          font: "gameboy",
        }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 - 330, k.height() / 2 - 30)), // Centered position
        k.z(100),
      ],
      "missionContainer"
    );

    let numOf = k.add(
      [
        k.text(`${data.currNum} / ${data.goal}`, {
          size: 20,
          font: "gameboy",
        }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 - 330, k.height() / 2 + 50)), // Centered position
        k.z(100),
      ],
      "missionContainer"
    );

    let priceText = k.add(
      [
        k.text(`${data.coins} Coins`, {
          size: 18,
          font: "gameboy",
        }),
        k.fixed(),
        k.pos(k.vec2(k.width() / 2 + 215, k.height() / 2 + 50)), // Centered position
        k.z(100),
      ],
      "missionContainer"
    );

    collect.onClick(() => {
      if (gameState.getIsGamePaused()) return;
      gameState.playSound("tap");
      gameState.collectCoins(k);
      refreshItems(items);
    });

    items.push(sword);
    items.push(sword1);
    items.push(sword2);
    items.push(sword3);
    items.push(centerTextMission);
    items.push(collect);
    items.push(text);
    items.push(numOf);
    items.push(priceText);
  };

  const exit = k.add(
    [
      k.text("Exit", {
        size: 15,
        font: "gameboy",
      }),
      k.area({ shape: new k.Rect(k.vec2(0, 0), 60, 20) }),
      k.fixed(),
      k.pos(k.vec2(k.width() / 2 - 30, k.height() / 2 + 120)),
      k.z(100),
    ],
    "missionContainer"
  );

  items.push(exit);

  exit.onClick(async () => {
    if (gameState.getIsGamePaused()) return;
    gameState.playSound("tap");
    k.destroy(missionContainer);
    items.forEach((child) => {
      k.destroy(child);
    });
    if (gameState.getFirstMissionCount() == 0) {
      gameState.setFirstMissionCount();
      await dialog(
        k,
        k.vec2(250, 500),
        firstMissionDialog[gameState.getLocale()]
      );
    }
    gameState.setFreezePlayer(false);
  });

  createItem(currMission);
}

function refreshItems(items) {
  let newActiveMission = gameState.getCurrMission();
  // TEXT
  items[7].text = newActiveMission.text;
  // GOAL
  items[8].text = `${newActiveMission.currNum} / ${newActiveMission.goal}`;
  // PRICE
  items[9].text = `${newActiveMission.coins} COINS`;
}
