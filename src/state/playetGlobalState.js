import { gameState } from "./stateManagers";

export default function playerGlobalStateManager() {
    let instance = null;

    function createInstance() {
        let isSwordEquipped = false
        let isShieldEquipped = false
        let armor = 1
        let speed = 0
        let isPlayerWalking = false
        let isAttacking = false
        const maxHealth = 10
        let health = maxHealth
        let hasKey = false
        let enemiesKilled = 0
        let coins = 0
        let attackLevel = 0

        return {
            resetPlayerStatus() {
                isPlayerWalking = false
                health = maxHealth
                isAttacking = false
                if(gameState.getIsHardcore()) {
                    isSwordEquipped = false
                    isShieldEquipped = false
                    armor = 1
                    speed = 0
                    hasKey = false
                    enemiesKilled = 0
                    coins = 0
                    attackLevel = 0
                }
            },
            setIsSwordEquipped(value) {
                isSwordEquipped = value
            },
            getIsSwordEquipped: () => isSwordEquipped,
            setIsShieldEquipped(value) {
                isShieldEquipped = value
            },
            getIsShieldEquipped: () => isShieldEquipped,
            getIsPlayerWalking: () => isPlayerWalking,
            setIsPlayerWalking(value) {
                isPlayerWalking = value
            },
            getMaxHealth: () => maxHealth,
            setHealth(value) {
                health = value
            },
            increaseHealthFromHouse() {
                if(health < maxHealth) {
                    health += 0.5
                }
            },
            increaseHealthByPotion(num) {
                if(health < maxHealth) {
                    health += num
                    if(health > 100) {
                        health = 100
                    }
                }
            },
            getHealth: () => health,
            setHasKey(value) {
                hasKey = value
            },
            getHasKey: () => hasKey,
            clearEnemiesCount() {
                enemiesKilled = 0
            },
            getEnemiesKilled: () => enemiesKilled,
            increaseEnemiesKilled: () => {
                enemiesKilled++
            },
            getAttackLevel: () => attackLevel,
            setNewAttackLevel(value) {
                attackLevel = value
            },
            increaseCoinByOne() {
                coins++
            },
            increaseCoinByNum(num) {
                coins += num
            },
            reduceCoins(num) {
                coins -= num
            },
            getCoins: () => coins,
            clearCoins: () => coins = 0,
            getArmor: () => armor,
            setNewArmor() {
                if(armor < 4) {
                    armor++
                }
            },
            getSpeed: () => speed,
            setNewSpeed() {
                if(speed < 30) {
                    speed += 10
                }
            },
        }
    }

    return {
        getInstance() {
            if(!instance) {
                instance = createInstance()
            }

            return instance
        }
    }
}