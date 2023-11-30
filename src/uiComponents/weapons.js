import { playerState } from "../state/stateManagers.js";

export function weapons(k) {
  const isSwordEquipped = playerState.getIsSwordEquipped();
  const isShieldEquipped = playerState.getIsShieldEquipped();
  const isFireRingEquipped = playerState.getRing('fireRing');
  const weaponsContainer = k.add([k.fixed(), "weaponsContainer"]);

  if (isSwordEquipped) {
    weaponsContainer.add([
      k.sprite("assets", {
        frame: 180,
        width: 40,
        height: 40
      }),
      k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 12) }),
      k.anchor('topleft'),
      k.fixed(),
      k.pos(10, 250),
      k.z(100),
    ], 'weaponsContainer');
  }

  if (isShieldEquipped) {
    weaponsContainer.add([
      k.sprite("assets", {
        frame: 179,
        width: 45,
        height: 45
      }),
      k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 12) }),
      k.anchor('topleft'),
      k.fixed(),
      k.pos(7.5, 300),
      k.z(100),
    ], 'weaponsContainer');
  }

  if (isFireRingEquipped.equipped) {
    weaponsContainer.add([
      k.sprite("fire", {
        frame: 0,
        width: 50,
        height: 50
      }),
      k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 12) }),
      k.anchor('topleft'),
      k.fixed(),
      k.pos(9, 352),
      k.z(100),
    ], 'weaponsContainer');
  }

  return weaponsContainer;
}
