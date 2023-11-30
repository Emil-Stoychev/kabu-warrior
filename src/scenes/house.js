import menuText from "../content/menuText.js";
import {
  generateOldManComponents,
  startInteraction,
} from "../entities/oldman.js";
import {
  generatePlayerComponents,
  setPlayerMovement,
} from "../entities/player.js";
import { gameState, playerState } from "../state/stateManagers.js";
import { showDamage } from "../uiComponents/damage.js";
import { dialog } from "../uiComponents/dialog.js";
import { healthBar } from "../uiComponents/healthBar.js";
import { currMission, playerUnits, sideSlots } from "../uiComponents/playerUnits.js";
import { weapons } from "../uiComponents/weapons.js";
import {
  colorizeBackground,
  drawBoundaries,
  drawTiles,
  fetchMapData,
  playAnimIfNotPlaying,
  saveDataToLocalStorage,
} from "../utils.js";

export default async function house(k) {
  colorizeBackground(k, 27, 29, 52);
  gameState.stopSound('background')

  const mapData = await fetchMapData("./assets/maps/house.json");
  const map = k.add([k.pos(520, 200)]);

  const entities = {
    oldMan: null,
  };
  let player = null
  // let player = playerState.getPlayer();

  const layers = mapData?.layers;

  for (const layer of layers) {
    if (layer.name === "Boundaries") {
      drawBoundaries(k, map, layer);
      continue;
    }
    if (layer.name === "SpawnPoints") {
      for (const object of layer.objects) {
        if (object.name === "player") {
          player = map.add(
            generatePlayerComponents(k, k.vec2(object.x, object.y))
          );
          continue;
        }

        if (object.name === "oldman") {
          entities.oldMan = map.add(
            generateOldManComponents(k, k.vec2(object.x, object.y))
          );
          continue;
        }
      }

      continue;
    }

    drawTiles(k, map, layer, mapData?.tileheight, mapData?.tilewidth);
  }

  if(gameState.getFirstWelcome() == 0) {
    await dialog(k, k.vec2(250, 500), menuText[gameState.getLocale()].firstWelcomeText)
    gameState.setFirstWelcome()
  }

  k.onUpdate(() => {
    if (playerState && gameState) {
        if (playerState.hasPlayerStateChanged() || gameState.hasGameStateChanged()) {
            let data = {
                ...playerState.getDataForStorageFromPlayerState(),
                ...gameState.getDataForStorageFromGlobalState()
            };

            const encryptionKey = 'kabu-warrior-game-data'; // Replace with your actual key
            saveDataToLocalStorage("sessionGame", data, encryptionKey);
        }
    }
});

  k.camScale(4);
  k.camPos(player.worldPos());
  k.onUpdate(() => {
    if (player.pos.dist(k.camPos())) {
      k.tween(
        k.camPos(),
        player.worldPos(),
        0.15,
        (newPos) => {
          k.camPos(newPos);
        },
        k.easings.linear
      );
    }
  });
  setPlayerMovement(k, player);

  let increaseHealthPlayerLoop = k.loop(10, () => {
    if (playerState.getHealth() < playerState.getMaxHealth()) {
      k.destroyAll("heartsContainer");
      gameState.playSound('heal')
      playerState.increaseHealthFromHouse();
      showDamage(k, 0.5, true, true)
      playerUnits(k, player)
      healthBar(k);
    }
  });

  if (playerState.getHealth() > -playerState.getMaxHealth()) {
    clearInterval(increaseHealthPlayerLoop);
  }

  player.onCollide("door-exit", () => {
    gameState.playSound("door");
    gameState.setPreviousScene("house");
    k.go("world");
  });

  player.onCollide("oldman", () => {
    startInteraction(k, entities.oldMan, player);
  });

  player.onCollideEnd("oldman", () => {
    playAnimIfNotPlaying(entities.oldMan, "oldman-down");
  });

  k.onKeyPress((key) => {
    if (key === "m" || key === "м") {
      gameState.setMute();
    }
  });

  k.onKeyPress((key) => {
    if(key === 'i' || key === 'и') {
      currMission(k)
    }
  })

  k.destroyAll("weaponsContainer");
  sideSlots(k)
  playerUnits(k, player)
  weapons(k);
  healthBar(k);
}
