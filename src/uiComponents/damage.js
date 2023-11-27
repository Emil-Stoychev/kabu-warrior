import { gameState } from "../state/stateManagers";

export function showDamage(k, numOfDamage, option, heal) {
    const randomOffsetX = Math.random() * 60 - 30;
    const randomOffsetY = Math.random() * option ? 150 - 30 : 60 - 30;
    const damagePosition = k.vec2(k.width() / 1.9 + randomOffsetX, k.height() / 2 + randomOffsetY);
    if(numOfDamage >= 7) gameState.playSound('criticalDamage')

    let damageContainer = k.add([
        k.text(`${heal ? '+' : '-'}${numOfDamage.toFixed(3)}`, { 
            size: numOfDamage >= 7 ? 35 : numOfDamage < 7 && numOfDamage > 2 ? 30 : 24, 
            font: 'gameboy', 
        }),
        k.color(heal ? (53,255,21) : 255, numOfDamage >= 7 ? 0 : 243, numOfDamage >= 5 ? 0 : 220),
        k.area(),
        k.anchor('center'),
        k.fixed(),
        k.pos(damagePosition),
        k.z(100),
        'showDamage'
    ], "showDamage");

    k.wait(0.7, () => {
        k.destroy(damageContainer);
    });
}
