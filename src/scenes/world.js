import {
  generatePlayerComponents,
  setPlayerMovement,
} from "../entities/player.js";
import {
  generateBunnyComponents,
  generateFrogComponents,
  generateSlimeComponents,
  generateGhostComponents,
  setEnemyAI,
} from "../entities/enemies.js";
import { gameState, playerState } from "../state/stateManagers.js";
import { healthBar } from "../uiComponents/healthBar.js";
import {
  colorizeBackground,
  drawBoundaries,
  drawTiles,
  fetchMapData,
  onAttacked,
  onCollideWithPlayer,
  onFireCollideWithPlayer,
} from "../utils.js";
import { weapons } from "../uiComponents/weapons.js";
import { bossLocked, comingSoon } from "../uiComponents/centerTexts.js";
import { currMission, playerUnits } from "../uiComponents/playerUnits.js";
import { chest } from "../uiComponents/chest.js";
import sonLines from "../content/sonDialogue.js";
import { dialog } from "../uiComponents/dialog.js";
import { missions } from "../uiComponents/missions.js";

export default async function world(k) {
  gameState.clearEntities();
  if(!gameState.getSound('background').playing()) {
    gameState.playSound('background')
  }
  const previousScene = gameState.getPreviousScene();
  const nextScene = gameState.getNextScene();
  const mapData = await fetchMapData(
    `./assets/maps/${
      nextScene != undefined ? `${nextScene}.json` : "world.json"
    }`
  );
  const entities = gameState.getEntities();

  colorizeBackground(k, 76, 170, 255);
  const map = k.add([k.pos(0, 0)]);

  const layers = mapData?.layers;

  for (const layer of layers) {
    if (layer.name === "Boundaries") {
      drawBoundaries(k, map, layer);
      continue;
    }

    if (layer.name === "SpawnPoints") {
      for (const object of layer.objects) {

        if (object.name === "player" && !previousScene && !nextScene) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (object.name === "player" && previousScene === "house") {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "player-dungeon" &&
          previousScene === "dungeon"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-to-world" &&
          previousScene &&
          previousScene === "world1" &&
          nextScene &&
          nextScene === "world"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-to-world1" &&
          previousScene &&
          previousScene === "world" &&
          nextScene &&
          nextScene === "world1"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world2-to-world1" &&
          previousScene &&
          previousScene === "world2" &&
          nextScene &&
          nextScene === "world1"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world1-to-world2" &&
          previousScene &&
          previousScene === "world1" &&
          nextScene &&
          nextScene === "world2"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world3-to-world2" &&
          previousScene &&
          previousScene === "world3" &&
          nextScene &&
          nextScene === "world2"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world2-to-world3" &&
          previousScene &&
          previousScene === "world2" &&
          nextScene &&
          nextScene === "world3"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world3" &&
          previousScene &&
          previousScene === "world3" &&
          nextScene &&
          nextScene === "world4"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world4" &&
          previousScene &&
          previousScene === "world4" &&
          nextScene &&
          nextScene === "world3"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world5-to-world3" &&
          previousScene &&
          previousScene === "world5" &&
          nextScene &&
          nextScene === "world3"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world4-to-world3" &&
          previousScene &&
          previousScene === "world4" &&
          nextScene &&
          nextScene === "world3"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world5" &&
          previousScene &&
          previousScene === "world5" &&
          nextScene &&
          nextScene === "world4"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world4-to-world5" &&
          previousScene &&
          previousScene === "world4" &&
          nextScene &&
          nextScene === "world5"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        } else if (
          object.name === "spawn-from-world3-to-world5" &&
          previousScene &&
          previousScene === "world3" &&
          nextScene &&
          nextScene === "world5"
        ) {
          gameState.setNewEntity(
            "player",
            map.add(generatePlayerComponents(k, k.vec2(object.x, object.y)))
          );
          continue;
        }

        if (object.name === "slime") {
          gameState.setNewEntity(
            "slimes",
            map.add(generateSlimeComponents(k, k.vec2(object.x, object.y)))
          );
        }

        if (object.name === "frog") {
          gameState.setNewEntity(
            "frogs",
            map.add(generateFrogComponents(k, k.vec2(object.x, object.y)))
          );
        }

        if (object.name === "bunny") {
          gameState.setNewEntity(
            "bunnies",
            map.add(generateBunnyComponents(k, k.vec2(object.x, object.y)))
          );
        }

        if (object.name === "ghost") {
          gameState.setNewEntity(
            "ghosts",
            map.add(generateGhostComponents(k, k.vec2(object.x, object.y)))
          );
        }

        if (object.name === "ghost-chest") {
          map.add([
            k.sprite("assets", {
              frame: playerState.getIsShieldEquipped() ? 138 : 137,
            }),
            k.area(),
            k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            "ghost-chest",
          ]);
          continue;
        }

        if (object.name === "seller") {
          let seller = map.add([
            k.sprite("assets", {
              frame: 964,
            }),
            k.area({shape: new k.Rect(k.vec2(3, 4), 10, 14)}),
            k.body({ isStatic: true }),
            k.pos(object.x - 10, object.y + 5),
            "seller",
          ]);

          seller.onCollide("player", (player) => {
            gameState.playSound('backpack')
            gameState.setFreezePlayer(true)
            chest(k, player)
          });
          continue;
        }

        if (object.name === "fire") {
          let fire = map.add([
            k.sprite("assets", {
              frame: 489,
              anim: 'fire-anim',
            }),
            k.area({ shape: new k.Rect(k.vec2(4, 4), 8, 5) }),
            k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            "fire",
          ]);

          fire.onCollide("player", (player) => {
            onFireCollideWithPlayer(k, player);
          });
          continue;
        }

        if (object.name === "missionPerson") {
          let missionPerson = map.add([
            k.sprite("assets", {
              frame: 944,
            }),
            k.area({shape: new k.Rect(k.vec2(3, 4), 10, 14)}),
            k.body({ isStatic: true }),
            k.pos(object.x - 10, object.y + 5),
            "missionPerson",
          ]);

          missionPerson.onCollide("player", (player) => {
            gameState.playSound('backpack')
            gameState.setFreezePlayer(true)
            missions(k, player)
          });
          continue;
        }

        if (object.name === "savedPersonFromBoss") {
          if(gameState.getIsGhostDefeated()) {
            let savedPersonFromBoss = map.add([
              k.sprite("assets", {
                frame: 940,
              }),
              k.area({shape: new k.Rect(k.vec2(3, 4), 10, 14)}),
              k.body({ isStatic: true }),
              k.pos(object.x - 10, object.y + 5),
              "savedPersonFromBoss",
            ]);
            
            savedPersonFromBoss.onCollide("player", async() => {
              await dialog(k, k.vec2(250, 500), sonLines[gameState.getLocale()][sonLines[gameState.getLocale()].length - 1])
            });
            continue;
          }
          continue
        }


      }
      continue;
    }
    drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
  }

  k.camScale(4);
  k.onUpdate(() => {
    if (entities.player.pos.dist(k.camPos())) {
      k.tween(
        k.camPos(),
        entities.player.worldPos(),
        0.15,
        (newPos) => {
          k.camPos(newPos);
        },
        k.easings.linear
      );
    }
  });

  setPlayerMovement(k, entities.player);

  for (const slime of entities.slimes) {
    setEnemyAI(k, slime, "slime", entities.player);
    onAttacked(k, slime, entities.player, 'slime');
    onCollideWithPlayer(k, slime, 'slime');
  }

  for (const frog of entities.frogs) {
    setEnemyAI(k, frog, "frog", entities.player);
    onAttacked(k, frog, entities.player, 'frog');
    onCollideWithPlayer(k, frog, 'frog');
  }

  for (const bunny of entities.bunnies) {
    setEnemyAI(k, bunny, "bunny", entities.player);
    onAttacked(k, bunny, entities.player, 'bunny');
    onCollideWithPlayer(k, bunny, 'bunny');
  }

  for (const ghost of entities.ghosts) {
    setEnemyAI(k, ghost, "ghost", entities.player);
    onAttacked(k, ghost, entities.player, 'ghost');
    onCollideWithPlayer(k, ghost, 'ghost');
  }

  entities.player.onCollide("door-entrance", () => {
    gameState.playSound('door')
    k.go("house");
  });

  entities.player.onCollide("dungeon-door-entrance", () => {
    if(gameState.getIsBossUnlocked()) {
      gameState.stopSound('background')
      gameState.playSound('door')
      k.go("dungeon");
    } else {
      k.destroyAll('bossLocked')
      bossLocked(k)
    }
  });

  entities.player.onCollide("world1-from-world", async () => {
    await gameState.setPreviousScene("world");
    await gameState.setNextScene("world1");
    k.go("world");
  });

  entities.player.onCollide("world-from-world1", async () => {
    await gameState.setPreviousScene("world1");
    await gameState.setNextScene("world");
    k.go("world");
  });

  entities.player.onCollide("world2-from-world1", async () => {
    await gameState.setPreviousScene("world1");
    await gameState.setNextScene("world2");
    k.go("world");
  });

  entities.player.onCollide("world1-from-world2", async () => {
    await gameState.setPreviousScene("world2");
    await gameState.setNextScene("world1");
    k.go("world");
  });

  entities.player.onCollide("world3-from-world2", async () => {
    await gameState.setPreviousScene("world2");
    await gameState.setNextScene("world3");
    k.go("world");
  });

  entities.player.onCollide("world2-from-world3", async () => {
    await gameState.setPreviousScene("world3");
    await gameState.setNextScene("world2");
    k.go("world");
  });

  entities.player.onCollide("world4-from-world3", async () => {
    await gameState.setPreviousScene("world3");
    await gameState.setNextScene("world4");
    k.go("world");
  });

  entities.player.onCollide("world3-from-world4", async () => {
    await gameState.setPreviousScene("world4");
    await gameState.setNextScene("world3");
    k.go("world");
  });

  entities.player.onCollide("world5-from-world3", async () => {
    await gameState.setPreviousScene("world3");
    await gameState.setNextScene("world5");
    k.go("world");
  });

  entities.player.onCollide("world3-from-world5", async () => {
    await gameState.setPreviousScene("world5");
    await gameState.setNextScene("world3");
    k.go("world");
  });

  entities.player.onCollide("world4-from-world5", async () => {
    await gameState.setPreviousScene("world5");
    await gameState.setNextScene("world4");
    k.go("world");
  });

  entities.player.onCollide("world5-from-world4", async () => {
    await gameState.setPreviousScene("world4");
    await gameState.setNextScene("world5");
    k.go("world");
  });

  entities.player.onCollide("coming-soon", async () => {
    k.destroyAll('comingSoon')
    comingSoon(k)
  });

  entities.player.onCollide("ghost-chest", async (ghostChest) => {
    if (!playerState.getIsShieldEquipped()) {
      gameState.playSound('chestOpened')
      const shield = k.add([
        k.sprite("assets", { frame: 179 }),
        k.pos(274, 92),
        k.area(),
        "shield",
      ]);

      shield.onCollide("player", () => {
        gameState.playSound('getShield')
        playerState.setHealth(playerState.getMaxHealth())
        playerState.setIsShieldEquipped(true), 
        k.destroy(shield);
        k.destroyAll('weaponsContainer');
        k.destroyAll('heartsContainer')
        healthBar(k, entities.player)
        weapons(k)
      });
      ghostChest.frame = 138;
    }
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

  k.onKeyPress((key) => {
    if(key === 'p' || key === 'п') {
      gameState.setIsGamePaused(entities.player)
    }
  })

  healthBar(k);
  k.destroyAll("weaponsContainer");
  weapons(k);
  playerUnits(k, entities.player)
}
