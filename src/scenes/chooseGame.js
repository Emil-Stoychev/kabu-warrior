import menuText from "../content/menuText.js";
import optionsText from "../content/optionsText.js";
import { gameState } from "../state/stateManagers.js";
import { colorizeBackground } from "../utils.js";

export default async function chooseGame(k) {
  const currentLocale = gameState.getLocale();
  colorizeBackground(k, 37, 42, 52);
  gameState.stopSound('background')
  gameState.playSound('mainMenuTrack')

  k.onKeyPress((key) => {
    if (key === "m" || key === "м") {
      gameState.setMute();
    }
  });

  k.add([k.sprite("logo"), k.pos(150, 0)]);

  let classic = k.add([
    k.text(menuText[currentLocale].classic, { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y),
  ]);

  let hardcore = k.add([
    k.text(menuText[currentLocale].hardcore, {
      size: 32,
      font: "gameboy",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 70),
  ]);

  classic.onClick(() => {
    gameState.playSound("tap");
    gameState.stopSound('mainMenuTrack')
    gameState.setIsHardcore(false);
    k.go("house");
  });

  hardcore.onClick(() => {
    gameState.playSound("tap");
    gameState.stopSound('mainMenuTrack')
    gameState.setIsHardcore(true);
    k.go("house");
  });

    //   BACK BUTTON
    let back = k.add([
      k.text(optionsText[currentLocale].back, { size: 32, font: "gameboy" }),
      k.area(),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 300),
    ]);

    back.onClick(() => {
      gameState.playSound("tap");
      k.go('mainMenu')
    })
}
