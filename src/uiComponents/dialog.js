import { gameState } from "../state/stateManagers.js"

async function displayLine(textContainer, line) {
    for (const char of line) {
        await new Promise((resolve) => {
            setTimeout(() => {
                textContainer.text += char
                resolve()
            }, 10)
        })
    }
}


export async function dialog(k, pos, content) {
    gameState.setFreezePlayer(true)
    
  const dialogBox = k.add([k.rect(800, 200), k.pos(pos), k.fixed()]);
  const textContainer = dialogBox.add([
    k.text("", {
      font: "gameboy",
      width: 700,
      lineSpacing: 15,
      size: gameState.getFontSize()
    }),
    k.color(27, 29, 52),
    k.pos(20, 40),
    k.fixed()
  ]);

  let index = 0

  gameState.playSound('typingText')
  await displayLine(textContainer, content[index])
  let lineFinishedDisplayed = true
  gameState.stopSound('typingText')
  
  const dialogKey = k.onKeyPress(async (key) => {
    if(key != 'space' && key != 'enter') return
    if(!lineFinishedDisplayed) return;

    index++
    if(!content[index]) {
        k.destroy(dialogBox)
        dialogKey.cancel()
        gameState.setFreezePlayer(false)

        return
    }

    textContainer.text = ''
    lineFinishedDisplayed = false
    gameState.playSound('typingText')
    await displayLine(textContainer, content[index])
    lineFinishedDisplayed = true
      gameState.stopSound('typingText')
  })
}
