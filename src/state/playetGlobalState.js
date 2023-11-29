import isEqual from "lodash/isEqual";
import { gameState } from "./stateManagers";
import { getDataFromLocalStorage } from "../utils";

export default function playerGlobalStateManager() {
  let instance = null;
  let prevPlayerState = null;

  function createInstance() {
    let isSwordEquipped = false;
    let isShieldEquipped = false;
    let armor = 1;
    let speed = 0;
    let isPlayerWalking = false;
    let isAttacking = false;
    const maxHealth = 10;
    let health = maxHealth;
    let hasKey = false;
    let enemiesKilled = 0;
    let rings = {
      fireRing: { power: 1.5, equipped: false },
    };
    let coins = 0;
    let attackLevel = 0;
    let player = null;

    const storedData = getDataFromLocalStorage('sessionGame', 'kabu-warrior-game-data');
    if (storedData) {
      const parsedData = storedData;
      isSwordEquipped = parsedData.isSwordEquipped || isSwordEquipped;
      isShieldEquipped = parsedData.isShieldEquipped || isShieldEquipped;
      armor = parsedData.armor || armor;
      speed = parsedData.speed || speed;
      health = parsedData.health || health;
      hasKey = parsedData.hasKey || hasKey;
      enemiesKilled = parsedData.enemiesKilled || enemiesKilled;
      coins = parsedData.coins || coins;
      attackLevel = parsedData.attackLevel || attackLevel;
      rings = parsedData.rings || rings
    }

    return {
      getDataForStorageFromPlayerState: () => {
        return {
          isSwordEquipped,
          isShieldEquipped,
          armor,
          speed,
          health,
          hasKey,
          enemiesKilled,
          coins,
          attackLevel,
          rings
        };
      },
      hasPlayerStateChanged: () => {
        const currentPlayerState = instance.getDataForStorageFromPlayerState();
        const hasChanged = !isEqual(prevPlayerState, currentPlayerState);
        prevPlayerState = { ...currentPlayerState };
        return hasChanged;
    },
      resetPlayerStatus() {
        prevPlayerState = null
        isPlayerWalking = false;
        health = maxHealth;
        isAttacking = false;
        if (gameState.getIsHardcore()) {
          isSwordEquipped = false;
          isShieldEquipped = false;
          armor = 1;
          speed = 0;
          hasKey = false;
          enemiesKilled = 0;
          coins = 0;
          attackLevel = 0;
          rings = {
            fireRing: { power: 1.5, equipped: false },
          }
        }
      },
      clearPlayerStatusAfterSetNewGame() {
        prevPlayerState = null
        isPlayerWalking = false;
        health = maxHealth;
        isAttacking = false;
        isSwordEquipped = false;
        isShieldEquipped = false;
        armor = 1;
        speed = 0;
        hasKey = false;
        enemiesKilled = 0;
        coins = 0;
        attackLevel = 0;
        rings = {
          fireRing: { power: 1.5, equipped: false },
        }
      },
      setNewPlayer(newPlayer) {
        player = newPlayer;
      },
      getPlayer: () => player,
      setIsSwordEquipped(value) {
        isSwordEquipped = value;
      },
      getRing: (ring) => {
        if(rings[ring]) {
          return rings[ring]
        }
      },
      setNewRing(newRing) {
        if(rings[newRing]) {
          rings[newRing].equipped = true
        }
      },
      getIsSwordEquipped: () => isSwordEquipped,
      setIsShieldEquipped(value) {
        isShieldEquipped = value;
      },
      getIsShieldEquipped: () => isShieldEquipped,
      getIsPlayerWalking: () => isPlayerWalking,
      setIsPlayerWalking(value) {
        isPlayerWalking = value;
      },
      getMaxHealth: () => maxHealth,
      setHealth(value) {
        health = value;
      },
      increaseHealthFromHouse() {
        if (health < maxHealth) {
          health += 0.5;
        }
      },
      increaseHealthByPotion(num) {
        if (health < maxHealth) {
          health += num;
          if (health > 100) {
            health = 100;
          }
        }
      },
      getHealth: () => health,
      setHasKey(value) {
        hasKey = value;
      },
      getHasKey: () => hasKey,
      clearEnemiesCount() {
        enemiesKilled = 0;
      },
      getEnemiesKilled: () => enemiesKilled,
      increaseEnemiesKilled: () => {
        enemiesKilled++;
      },
      getAttackLevel: () => attackLevel,
      setNewAttackLevel(value) {
        attackLevel = value;
      },
      increaseCoinByOne() {
        coins++;
      },
      increaseCoinByNum(num) {
        coins += num;
      },
      reduceCoins(num) {
        coins -= num;
      },
      getCoins: () => coins,
      clearCoins: () => (coins = 0),
      getArmor: () => armor,
      setNewArmor() {
        if (armor < 4) {
          armor++;
        }
      },
      getSpeed: () => speed,
      setNewSpeed() {
        if (speed < 30) {
          speed += 10;
        }
      },
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
}
