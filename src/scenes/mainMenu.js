import menuText from "../content/menuText.js";
import { gameState } from "../state/stateManagers.js";
import { colorizeBackground, getDataFromLocalStorage } from "../utils.js";

export default async function mainMenu(k) {
  const currentLocale = gameState.getLocale();
  colorizeBackground(k, 37, 42, 52);
  gameState.stopSound('background')
  gameState.playSound('mainMenuTrack')

  k.add([k.sprite("logo"), k.pos(150, 0)]);
  let getLocalStorage = getDataFromLocalStorage('sessionGame', 'kabu-warrior-game-data')

  if(getLocalStorage != null) {
    let resumeGame = k.add([
    k.text(menuText[currentLocale].resume, { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 60),
  ]);

  resumeGame.onClick(() => {
    gameState.playSound("tap");
    k.go("house");
  });
}

  let newGame = k.add([
    k.text(menuText[currentLocale].title, { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y),
  ]);

  let options = k.add([
    k.text(menuText[currentLocale].playIndication, {
      size: 32,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 70),
  ]);

  k.add([
    k.text(menuText[currentLocale].languageIndication, {
      size: 18,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 300),
  ]);

  k.onKeyPress("f", () => {
    if (currentLocale !== "BG") gameState.setLocale("BG");
    if (currentLocale !== "EN") gameState.setLocale("EN");
    k.go("mainMenu");
  });

  k.onKeyPress((key) => {
    if (key === "m" || key === "м") {
      gameState.setMute();
    }
  });

  newGame.onClick(() => {
    gameState.playSound("tap");
    k.go("chooseGame");
  });

  options.onClick(() => {
    gameState.playSound("tap");
    k.go("options");
  });
}
