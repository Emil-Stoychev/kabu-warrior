import { gameState, playerState } from "../state/stateManagers";
import { maxLevelText, notEnoughCoins } from "./centerTexts";
import { healthBar } from "./healthBar";
import { playerUnits } from "./playerUnits.js";

export async function chest(k, player) {
  let arm = playerState.getArmor()
  let spe = playerState.getSpeed()
  let items = [];

  let backpack = k.add([
    k.rect(600, 300),
    k.color(100, 100, 100),
    k.fixed(),
    k.pos(k.vec2(k.width() / 2 - 300, k.height() / 2 - 150)),
    "backpack",
  ]);

  const createItem = (frame, x, y, effectText, price) => {
    const item = k.add(
      [
        k.sprite("assets", {
          frame: frame,
          width: 100,
          height: 100,
        }),
        k.area({ shape: new k.Rect(k.vec2(3, 4), 100, 100) }),
        k.fixed(),
        k.pos(k.vec2(x, y)), // Centered position
        k.z(100),
        "item",
      ],
      "backpack"
    );

    let text = k.add(
      [
        k.text(effectText, {
          size: 15,
          font: "gameboy",
        }),
        k.fixed(),
        k.pos(k.vec2(x, y + 110)), // Centered position
        k.z(100),
      ],
      "backpack"
    );

    let priceText = k.add(
      [
        k.text(`${price == 10 ? '10 Coins' : price}`, {
          size: 15,
          font: "gameboy",
        }),
        k.fixed(),
        k.pos(k.vec2(x, y + 140)), // Centered position
        k.z(100),
      ],
      "backpack"
    );

    item.onClick(() => {
      if (gameState.getIsGamePaused()) return;
      let sp = playerState.getSpeed();
      let ar = playerState.getArmor();
      let hl = playerState.getHealth();
      let maxHl = playerState.getMaxHealth();
      let currCoins = playerState.getCoins();

      gameState.playSound("tap");
      if (effectText === "Health +1") {
        if (hl < maxHl) {
          if (currCoins >= price) {
            if(hl + 1 > maxHl) {
              playerState.setHealth(maxHl)
            } else {
              playerState.increaseHealthByPotion(1);
            }
            playerState.reduceCoins(price);
            gameState.playSound("drinkPotion");
            k.destroyAll("heartsContainer");
            healthBar(k, player);
            playerUnits(k)
          } else {
            notEnoughCoins(k)
          }
        } else {
            maxLevelText(k, 'health')
        }
      } else if (effectText === "Speed +10") {
        if (sp < 30) {
          if (currCoins >= (sp == 0 ? 100 : sp == 10 ? 250 : sp == 20 ? 500 : 'MAXED')) {
            playerState.reduceCoins((sp == 0 ? 100 : sp == 10 ? 250 : sp == 20 ? 500 : 'MAXED'));
            playerState.setNewSpeed();
            gameState.playSound("drinkPotion");
            playerUnits(k)
            refreshItemsPrice(items)
          } else {
            notEnoughCoins(k)
          }
        } else {
            maxLevelText(k, 'speed')
        }
      } else if (effectText === "Armor +1") {
        if (ar < 4) {
          if (currCoins >= (ar == 1 ? 100 : ar == 2 ? 250 : ar == 3 ? 500 : 'MAXED')) {
            playerState.reduceCoins((ar == 1 ? 100 : ar == 2 ? 250 : ar == 3 ? 500 : 'MAXED'));
            playerState.setNewArmor();
            gameState.playSound("drinkPotion");
            playerUnits(k)
            refreshItemsPrice(items)
          } else {
            notEnoughCoins(k)
          }
        } else {
            maxLevelText(k, 'armor')
        }
      }
    });

    items.push(item);
    items.push(text);
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
    "backpack"
  );

  items.push(exit);

  exit.onClick(() => {
    if (gameState.getIsGamePaused()) return;
    gameState.playSound("tap");
    k.destroy(backpack);
    items.forEach((child) => {
      k.destroy(child);
    });
    gameState.setFreezePlayer(false);
  });

  createItem(140, k.width() / 2 - 200, k.height() / 2 - 100, "Health +1", 10);
  createItem(141, k.width() / 2 - 50, k.height() / 2 - 100, "Speed +10", spe == 0 ? 100 + ' Coins' : spe == 10 ? 250 + ' Coins' : spe == 20 ? 500 + ' Coins' : 'MAXED');
  createItem(139, k.width() / 2 + 100, k.height() / 2 - 100, "Armor +1", arm == 1 ? 100 + ' Coins' : arm == 2 ? 250 + ' Coins' : arm == 3 ? 500 + ' Coins' : 'MAXED');
}

function refreshItemsPrice(items) {
  let sp = playerState.getSpeed();
  let ar = playerState.getArmor();

  items[6].text = `${sp == 0 ? 100 + ' Coins' : sp == 10 ? 250 + ' Coins' : sp == 20 ? 500 + ' Coins' : 'MAXED'}`
  items[9].text = `${ar == 1 ? 100 + ' Coins' : ar == 2 ? 250 + ' Coins' : ar == 3 ? 500 + ' Coins' : 'MAXED'}`
}
