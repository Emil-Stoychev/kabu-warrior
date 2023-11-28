import sonLines from "../content/sonDialogue.js";
import {
  generateGhostComponents,
  onGhostDestroyed,
  setGhostAI,
} from "../entities/ghost.js";
import {
  generatePlayerComponents,
  setPlayerMovement,
} from "../entities/player.js";
import { gameState, playerState } from "../state/stateManagers.js";
import { comingSoon } from "../uiComponents/centerTexts.js";
import { dialog } from "../uiComponents/dialog.js";
import { healthBar } from "../uiComponents/healthBar.js";
import { currMission, playerUnits } from "../uiComponents/playerUnits.js";
import { weapons } from "../uiComponents/weapons.js";
import {
  colorizeBackground,
  drawBoundaries,
  drawTiles,
  fetchMapData,
  onAttacked,
  onCollideWithPlayer,
  onFireCollideWithPlayer,
  slideCamY,
} from "../utils.js";

export default async function dungeon(k) {
  colorizeBackground(k, 27, 29, 52);
  gameState.stopSound('background')

  const mapData = await fetchMapData("./assets/maps/dungeon.json");
  const map = k.add([k.pos(420, 95)]);

  const entities = {
    ghost: null,
  };
  let player = null

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

        if (object.name === "ghost" && !gameState.getIsGhostDefeated()) {
          entities.ghost = map.add(
            generateGhostComponents(k, k.vec2(object.x, object.y))
          );
          onCollideWithPlayer(k, entities.ghost);
          continue;
        }

        if (object.name === "prison-door") {
          map.add([
            k.sprite("assets", {
              frame: playerState.getHasKey() ? 506 : 505,
            }),
            !playerState.getHasKey() && k.area(),
            !playerState.getHasKey() && k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            "prison-door",
          ]);
          continue;
        }

        if (object.name === "prison-door-bottom") {
          map.add([
            k.sprite("assets", {
              frame: 505,
            }),
            k.area(),
            k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            "prison-door-bottom",
          ]);
          continue;
        }

        if (object.name === "prison-door-top-left") {
          map.add([
            k.sprite("assets", {
              frame: 505,
            }),
            k.area(),
            k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            "prison-door-top-left",
          ]);
          continue;
        }

        if (object.name === "trap") {
          let trap = map.add([
            k.sprite("assets", {
              frame: 459,
            }),
            k.area({ shape: new k.Rect(k.vec2(4, 4), 8, 5) }),
            k.z(1),
            k.pos(object.x, object.y),
            "prison-door-top-left",
          ]);

          trap.onCollide('player', (player) => {
            onFireCollideWithPlayer(k, player);
          })
          continue;
        }

        if (object.name === "laboratory-boss") {
          let laboratoryBoss = map.add([
            k.sprite("assets", {
              frame: 458,
            }),
            k.area(),
            k.z(1),
            k.pos(object.x, object.y),
            "laboratory-boss",
          ]);

          laboratoryBoss.onCollide('player', () => {
            if(gameState.getIsGhostDefeated()) {
              comingSoon(k)
            }
          })
          continue;
        }



        if (object.name === "son") {
          if (!gameState.getIsGhostDefeated() || !gameState.setIsSonSaved()) {
            let son = map.add([
              k.sprite("assets", {
                frame: 940,
              }),
              k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 14) }),
              k.body({ isStatic: true }),
              k.pos(object.x - 10, object.y + 5),
              "son",
            ]);

            son.onCollide("player", async () => {
              await dialog(
                k,
                k.vec2(250, 500),
                sonLines[gameState.getLocale()][2]
              );
            });
            continue;
          }
          continue;
        }
      }
      continue;
    }

    drawTiles(k, map, layer, mapData?.tileheight, mapData?.tilewidth);
  }

  k.onUpdate(() => {
    if (playerState && gameState) {
      if (playerState.hasPlayerStateChanged() || gameState.hasGameStateChanged()) {
        let data = {
          ...playerState.getDataForStorageFromPlayerState(),
          ...gameState.getDataForStorageFromGlobalState()
        };
        localStorage.setItem("sessionGame", JSON.stringify(data));
      }
    }
  });

  player.pos.y -= 20;
  setPlayerMovement(k, player);

  player.onCollide("door-exit", () => {
    gameState.playSound("door");
    gameState.setPreviousScene("dungeon");
    gameState.stopSound("musicOnBossBattle");
    gameState.playSound('background')
    k.go("world");
  });

  player.onCollide("door-entrance", async () => {
    if (!gameState.getIsGhostDefeated()) {
      gameState.playSound("musicToBossTransition");
      k.wait(10, () => {
        gameState.playSound("musicOnBossBattle");
      });
    }
    gameState.setFreezePlayer(true);
    await slideCamY(k, -180, gameState.getIsGhostDefeated() ? 1 : 12);
    player.pos.y -= 50;
    gameState.setFreezePlayer(false);
  });

  player.onCollide("door-exit-2", async () => {
    if (!gameState.getIsGhostDefeated()) return;
    gameState.stopSound("musicOnBossBattle");
    gameState.setFreezePlayer(true);
    await slideCamY(k, 180, 1);
    player.pos.y += 50;
    gameState.setFreezePlayer(false);
  });

  player.onCollide("prison-door", async (prisonDoor) => {
    await dialog(
      k,
      k.vec2(250, 500),
      sonLines[gameState.getLocale()][playerState.getHasKey() ? 1 : 0]
    );

    if (playerState.getHasKey()) {
      gameState.playSound("door");
      prisonDoor.frame = 506;
      prisonDoor.unuse("body");
      prisonDoor.unuse("area");
      gameState.setIsSonSaved(true);
  
      let currMission = gameState.getCurrMission()
      if(currMission && currMission.name === 'boss' && gameState.getIsGhostDefeated() && gameState.getIsSonSaved()) {
        gameState.completeMissionIfItIsReady()
      }
    }
  });

  if (entities.ghost) {
    setGhostAI(k, entities.ghost, player);
    onAttacked(k, entities.ghost, player);
    onCollideWithPlayer(k, entities.ghost);
    onGhostDestroyed(k);
  }

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

  k.camScale(4);
  k.destroyAll("weaponsContainer");
  playerUnits(k, player);
  weapons(k);
  healthBar(k);
}
