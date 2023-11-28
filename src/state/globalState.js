import isEqual from "lodash/isEqual";
import k from '../kaboomContext'
import { gamePausedText, incompleteMission, missionSuccess } from '../uiComponents/centerTexts';
import { playerUnits } from '../uiComponents/playerUnits';
import { playerState } from './stateManagers';
import { Howl } from 'howler';
import { getDataFromLocalStorage } from "../utils";

export default function globalStateManager() {
  let instance = null;
  let prevGameState = null;

  function createInstance() {
    let isHardore = false
    let mute = false
    let pauseGame = false
    let pauseScreen = null
    let previousScene = null;
    let nextScene = null;
    let freezePlayer = false;
    let isGhostDefeated = false;
    let bossUnlocked = false;
    let isSonSaved = false;
    let currMissionNum = 0
    let firstWelcome = 0
    let missionsArray = [
      {name: 'slime', complete: false, missionActive: true, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill slimes to complete the\nmission and get reward!'},
      {name: 'frog', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill frogs to complete the\nmission and get reward!'},
      {name: 'bunny', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill bunnies to complete the\nmission and get reward!'},
      {name: 'ghost', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill ghosts to complete the\nmission and get reward!'},
      {name: 'boss', complete: false, missionActive: false, currNum: 0, goal: 1, coins: 150, text: 'Kill the boss and save the\nperson inside the prison!'},
    ];
    let locale = "EN";
    let fontSize = 28;
    let entities = {
      slimes: [],
      frogs: [],
      bunnies: [],
      ghosts: [],
      boss: [],
    };
    let sounds = {
      background: new Howl({ src: ['./assets/sounds/background.wav'], loop: true }),
      playerWalk: new Howl({ src: ['./assets/sounds/walk.wav'], volume: 0.3 }),
      portalStart: new Howl({ src: ['./assets/sounds/loadingTransition.wav'], volume: 0.7 }),
      door: new Howl({ src: ['./assets/sounds/door.wav'],  }),
      pauseGame: new Howl({ src: ['./assets/sounds/pauseGame.wav'], volume: 0.6 }),
      pauseGameReversed: new Howl({ src: ['./assets/sounds/pauseGameReversed.mp3'], volume: 0.6 }),
      heal: new Howl({ src: ['./assets/sounds/heal.mp3'], volume: 0.5 }),
      fear: new Howl({ src: ['./assets/sounds/fear.wav'], volume: 0.5 }),
      backpack: new Howl({ src: ['./assets/sounds/backpack.wav'],  }),
      tap: new Howl({ src: ['./assets/sounds/tap.wav'],  }),
      drinkPotion: new Howl({ src: ['./assets/sounds/drinkPotion.wav'],  }),
      getCoin: new Howl({ src: ['./assets/sounds/coin.wav'],  }),
      getKey: new Howl({ src: ['./assets/sounds/getKey.wav'],  }),
      levelUp: new Howl({ src: ['./assets/sounds/levelUp.wav'],  }),
      heartbeat: new Howl({ src: ['./assets/sounds/heartbeat.wav'], loop: true}),
      bossAttack: new Howl({ src: ['./assets/sounds/boss-attack.wav'],  }),
      yea: new Howl({ src: ['./assets/sounds/yea.wav'],  }),
      frogSound0: new Howl({ src: ['./assets/sounds/frog0.wav'], volume: 0.5 }),
      frogSound1: new Howl({ src: ['./assets/sounds/frog1.wav'], volume: 0.5 }),
      slimeSound0: new Howl({ src: ['./assets/sounds/slime0.wav'], volume: 0.5 }),
      slimeSound1: new Howl({ src: ['./assets/sounds/slime1.wav'], volume: 0.5 }),
      bunnySound0: new Howl({ src: ['./assets/sounds/bunny0.wav'], volume: 0.5 }),
      bunnySound1: new Howl({ src: ['./assets/sounds/bunny1.wav'], volume: 0.5 }),
      ghostSound0: new Howl({ src: ['./assets/sounds/ghost0.wav'], volume: 0.5 }),
      ghostSound1: new Howl({ src: ['./assets/sounds/ghost1.wav'], volume: 0.5 }),
      bossDie: new Howl({ src: ['./assets/sounds/boss-die.wav'],  }),
      musicToBossTransition: new Howl({ src: ['./assets/sounds/music-to-boss-transition.wav'],  }),
      musicOnBossBattle: new Howl({ src: ['./assets/sounds/music-on-boss-fighting.wav'],  }),
      mainMenuTrack: new Howl({ src: ['./assets/sounds/music-on-boss-fighting.wav'], volume: 0.3 }),
      criticalDamage: new Howl({ src: ['./assets/sounds/criticalDamage.wav'],  }),
      typingText: new Howl({ src: ['./assets/sounds/typingText.wav'] }),
      chestOpened: new Howl({ src: ['./assets/sounds/chestOpened.wav'],  }),
      getShield: new Howl({ src: ['./assets/sounds/getShield.wav'] }),
      getSword: new Howl({ src: ['./assets/sounds/getSword.wav'] }),
      gameOver: new Howl({ src: ['./assets/sounds/gameOver.wav']  }),
      entityDie0: new Howl({ src: ['./assets/sounds/entity-die0.wav'], volume: 0.7 }),
      entityDie1: new Howl({ src: ['./assets/sounds/entity-die1.wav'], volume: 0.7 }),
      sword0: new Howl({ src: ['./assets/sounds/sword0.wav'], volume: 0.7 }),
      sword1: new Howl({ src: ['./assets/sounds/sword1.wav'], volume: 0.7 }),
      sword2: new Howl({ src: ['./assets/sounds/sword2.wav'], volume: 0.7 }),
      playerHurt0: new Howl({ src: ['./assets/sounds/playerHurt0.wav'], volume: 0.7 }),
      playerHurt1: new Howl({ src: ['./assets/sounds/playerHurt1.wav'], volume: 0.7 }),
      playerHurt2: new Howl({ src: ['./assets/sounds/playerHurt2.wav'], volume: 0.7 }),
    };

    const storedData = getDataFromLocalStorage('sessionGame', 'kabu-warrior-game-data');
    if (storedData) {
        const parsedData = storedData;
        isHardore = parsedData.isHardore || isHardore;
        mute = parsedData.mute || mute;
        isGhostDefeated = parsedData.isGhostDefeated || isGhostDefeated;
        bossUnlocked = parsedData.bossUnlocked || bossUnlocked;
        isSonSaved = parsedData.isSonSaved || isSonSaved;
        currMissionNum = parsedData.currMissionNum || currMissionNum;
        firstWelcome = parsedData.firstWelcome || firstWelcome;
        missionsArray = parsedData.missionsArray || missionsArray;
        locale = parsedData.locale || locale;
    }

    return {
      getDataForStorageFromGlobalState: () => {
        return {
          isHardore,
          mute,
          isGhostDefeated,
          bossUnlocked,
          isSonSaved,
          currMissionNum,
          firstWelcome,
          missionsArray,
          locale,
        }
      },
      hasGameStateChanged: () => {
        const currentGameState = instance.getDataForStorageFromGlobalState();
        const hasChanged = !isEqual(prevGameState, currentGameState);
        prevGameState = { ...currentGameState };
        return hasChanged;
      },
      setMute: () => {
        mute = !mute

        if(mute) {
          for(const sound in sounds) {
            if(sounds[sound].playing()) {
              sounds[sound].stop()
            }
          }
        } else {
          if(previousScene == 'dungeon' || previousScene == 'house' || previousScene == 'world') {
            sounds['background'].play()
          }
        }
      },
      getIsGamePaused: () => pauseGame,
      setIsGamePaused: () => {
        pauseGame = !pauseGame
        if(pauseGame) {
          freezePlayer = true
          gamePausedText(k, true)
          if(!sounds['pauseGame'].playing() && !mute) {
            sounds['pauseGame'].play()
          }
          if(sounds['background'].playing()) {
            sounds['background'].stop()
          }
          pauseScreen = k.add([
            k.sprite("loadingScreen"),
            k.pos(-10, -60),
            k.fixed(),
            k.opacity(0.8),
            k.z(200)
          ]);
        } else {
          freezePlayer = false
          gamePausedText(k, false)
          if(!sounds['pauseGameReversed'].playing() && !mute) {
            sounds['pauseGameReversed'].rate(2)
            sounds['pauseGameReversed'].play()
          }
          if(!sounds['background'].playing()) {
            sounds['background'].play()
          }
          k.destroy(pauseScreen)
          pauseScreen = null
        }
      },
      getIsHardcore: () => isHardore,
      setIsHardcore: (value) => isHardore = value,
      getFirstWelcome: () => firstWelcome,
      setFirstWelcome: () => firstWelcome++
      ,
      getEntities: () => entities,
      setNewEntity(key, obj) {
          entities[key] = [...entities[key], obj];
      },
      getAllMissions: () => {
        return missionsArray
      },
      getCurrMission: () => {
        return missionsArray.find(x => x.missionActive)
      },
      completeMissionIfItIsReady() {
        let currMission = missionsArray.find((x, i) => i === currMissionNum) 
        if (currMission) {
          missionsArray = missionsArray.map((x, i) => {
            if(i === currMissionNum) {
              x.currNum++
              if(x.name === 'boss') {
                if(isGhostDefeated && isSonSaved && x.currNum >= x.goal) {
                  x.complete = true
                  x.currNum = x.goal
                }
              } else {
                if(i === currMissionNum &&  x.currNum >= x.goal) {
                  x.complete = true
                  x.currNum = x.goal
                }
              }
            }
              
            return x
          })
        }
      },
      collectCoins(k) {
        let oldMissionNum = currMissionNum
        let currMission = missionsArray.find((x, i) => i === currMissionNum) 
        if (currMission) {
          missionsArray = missionsArray.map((x) => {
              if(x.name === currMission.name && x.currNum >= x.goal && x.complete) {
                playerState.increaseCoinByNum(x.coins)
                playerUnits(k)
                currMissionNum++

                if(x.name === 'boss') {
                  x.missionActive = false
                } else {
                  x.currNum = 0
                  x.level++
                  x.goal *= 2
                  x.coins *= 2
                  x.missionActive = false
                }
              }
              return x
          })

          if(currMissionNum >= missionsArray.length - 1) {
            let nextMission = missionsArray.find((x, i) => i === currMissionNum)
            if(nextMission?.name === 'boss') {
              let findMissionWithLevelLowerThan5 = missionsArray.find(x => x?.level < 6) 
              if(findMissionWithLevelLowerThan5 && !isGhostDefeated && !isSonSaved) {
                currMissionNum = 0
                oldMissionNum = 0
              } else {
                if(isGhostDefeated && isSonSaved) {
                  currMissionNum = 0
                  oldMissionNum = 0
                } else {
                  bossUnlocked = true
                }
              }
            } else {   
              if(isGhostDefeated && isSonSaved) {
                currMissionNum = 0
                oldMissionNum = 0
              } else if(currMissionNum > missionsArray.length - 2) {
                currMissionNum = 0
                oldMissionNum = 0
              }
            }
            }

          missionsArray = missionsArray.map((x, i) => {
            if(i == currMissionNum) {
              x.missionActive = true
            }

            return x
          })

          if(oldMissionNum === currMissionNum) {
            incompleteMission(k)
          } else {
            sounds['levelUp'].play()
            missionSuccess(k)
          }
        }
      },
      clearEntities() {
        entities = {
            slimes: [],
            frogs: [],
            bunnies: [],
            ghosts: [],
            boss: [],
          };
      },
      resetGameStatus() {
        prevGameState = null
        previousScene = null;
        nextScene = null;
        freezePlayer = false;
        if(isHardore) {
        isGhostDefeated = false;
        isSonSaved = false;
        currMissionNum = 0
        missionsArray = [
          {name: 'slime', complete: false, missionActive: true, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill slimes to complete the\nmission and get reward!'},
          {name: 'frog', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill frogs to complete the\nmission and get reward!'},
          {name: 'bunny', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill bunnies to complete the\nmission and get reward!'},
          {name: 'ghost', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill ghosts to complete the\nmission and get reward!'},
          {name: 'boss', complete: false, missionActive: false, currNum: 0, goal: 1, coins: 150, text: 'Kill the boss and save the\nperson inside the prison!'},
        ];
      }
      },
      clearGameStatusAfterSetNewGame() {
        prevGameState = null
        previousScene = null;
        nextScene = null;
        freezePlayer = false;
        isGhostDefeated = false;
        isSonSaved = false;
        currMissionNum = 0
        firstWelcome = 0
        missionsArray = [
          {name: 'slime', complete: false, missionActive: true, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill slimes to complete the\nmission and get reward!'},
          {name: 'frog', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill frogs to complete the\nmission and get reward!'},
          {name: 'bunny', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill bunnies to complete the\nmission and get reward!'},
          {name: 'ghost', complete: false, missionActive: false, currNum: 0, goal: 1, level: 0, coins: 1, text: 'Kill ghosts to complete the\nmission and get reward!'},
          {name: 'boss', complete: false, missionActive: false, currNum: 0, goal: 1, coins: 150, text: 'Kill the boss and save the\nperson inside the prison!'},
        ];
      },
      setFreezePlayer(value) {
        freezePlayer = value;
      },
      getFreezePlayer: () => freezePlayer,
      getIsBossUnlocked: () => bossUnlocked,
      setFontSize(value) {
        fontSize = value;
      },
      getFontSize: () => fontSize,
      getLocale: () => locale,
      setLocale: (value) => {
        locale = value;
      },
      getPreviousScene: () => previousScene,
      setPreviousScene(sceneName) {
        previousScene = sceneName;
      },
      getNextScene: () => nextScene,
      setNextScene(sceneName) {
        nextScene = sceneName;
      },
      getIsGhostDefeated: () => isGhostDefeated,
      setIsGhostDefeated(value) {
        isGhostDefeated = value;
      },
      getIsSonSaved: () => isSonSaved,
      setIsSonSaved(value) {
        isSonSaved = value;
      },
      playSound(soundName) {
        if(mute) return
        if(soundName === 'sword') {
            let playerHitSound = sounds[`${soundName}${Math.floor(Math.random() * 3)}`]
            if(playerHitSound) {
              playerHitSound.play()
            }
        } else if(soundName === 'entityDie') {
            let entityDieSound = sounds[`${soundName}${Math.floor(Math.random() * 2)}`]
            if(entityDieSound) {
              entityDieSound.play()
            }
        } else if(soundName === 'playerHurt') {
            let playerHurt = sounds[`${soundName}${Math.floor(Math.random() * 3)}`]
            if(playerHurt) {
              playerHurt.play()
            }
        } else if(soundName === 'playerWalk') {
            if(!sounds[soundName].playing()) {
              sounds[soundName].play()
            }
        } else if(soundName === 'heartbeat') {
          if(!sounds['fear'].playing()) {
                sounds['fear'].play()
            }
            if (!sounds[soundName].playing()) {
              sounds[soundName].play()
            }
        } else if(soundName === 'bossAttack') {
          if (!sounds[soundName].playing()) {
            sounds[soundName].play()
              }
        } else {
          if(soundName === 'slimeSound' || soundName === 'frogSound' || soundName === 'bunnySound' || soundName === 'ghostSound') {
            soundName += Math.floor(Math.random() * 2) 
            sounds[soundName].play()
          } else {
            sounds[soundName].play()
          }
        }
      },
      stopSound(soundName) {
        if(sounds[soundName].playing()) {
          sounds[soundName].stop()
        }
      },
      getSound(soundName) {
        return sounds[soundName]
      }
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
