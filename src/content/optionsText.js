const EN = {
  title: "OPTIONS",
  next: "NEXT",
  prev: "PREV",
  main: {
    playerMovement: "W,A,S,D - player movement",
    missionInfo: "I - for mission information",
    sword: "SPACE - sword",
    playIndication: "OPTIONS",
  },
  playerInfo: {
    name: 'NAME: Kabu',
    health: 'HEALTH: 10',
    speed: 'SPEED: 60',
    attack: 'ATTACK: 1',
    criticalChance: 'CRITICAL CHANGE: 5%',
  },
  enemies: {
    slime: {
      name: 'NAME: Slime',
      health: 'HEALTH: 5',
      speed: 'SPEED: 30',
      attack: 'ATTACK: 0.5',
      poison: 'POISON: NO POISON'
    },
    frog: {
      name: 'NAME: Frog',
      health: 'HEALTH: 10',
      speed: 'SPEED: 15',
      attack: 'ATTACK: 2',
      poison: 'POISON: LOW SPEED'
    },
    bunny: {
      name: 'NAME: Bunny',
      health: 'HEALTH: 7',
      speed: 'SPEED: 50',
      attack: 'ATTACK: 1',
      poison: 'POISON: NO POISON'
    },
    ghost: {
      name: 'NAME: Ghost',
      health: 'HEALTH: 12',
      speed: 'SPEED: 30',
      attack: 'ATTACK: 1.5',
      poison: 'POISON: NO POISON'
    },
    seller: {
      name: 'NAME: Seller',
      health: 'ITEM: Health+1',
      speed: 'ITEM: Speed+10',
      attack: 'ITEM: Armor+1',
    },
    mission: {
      name: 'NAME: Mission',
      health: 'KILL ENEMIES',
      speed: 'TO EARN COINS',
      attack: 'AND UNLOCK THE',
      poison: 'DUNGEON FOR BOSS'
    },
  },
  back: "BACK",
};

const BG = {
  title: "ОПЦИИ",
  next: "СЛЕДВАЩО",
  prev: "ПРЕДИШНО",
  main: {
    playerMovement: "W,A,S,D - движение на героя",
    missionInfo: "I - за информация за мисията",
    sword: "SPACE - меч",
    playIndication: "ОПЦИИ",
  },
  playerInfo: {
    name: 'ИМЕ: Кабу',
    health: 'ЗДРАВЕ: 10',
    speed: 'СКОРОСТ: 60',
    attack: 'АТАКА: 1',
    criticalChance: 'ШАНС ЗА КРИТИЧЕН УДАР: 5%',
  },
  enemies: {
    slime: {
      name: 'ИМЕ: Слайм',
      health: 'ЗДРАВЕ: 5',
      speed: 'СКОРОСТ: 30',
      attack: 'АТАКА: 0.5',
      poison: 'ОТРОВА: БЕЗ ОТРОВА'
    },
    frog: {
      name: 'ИМЕ: Жаба',
      health: 'ЗДРАВЕ: 10',
      speed: 'СКОРОСТ: 15',
      attack: 'АТАКА: 2',
      poison: 'ОТРОВА: НИСКА СКОРОСТ'
    },
    bunny: {
      name: 'ИМЕ: Заек',
      health: 'ЗДРАВЕ: 7',
      speed: 'СКОРОСТ: 50',
      attack: 'АТАКА: 1',
      poison: 'ОТРОВА: БЕЗ ОТРОВА'
    },
    ghost: {
      name: 'ИМЕ: Призрак',
      health: 'ЗДРАВЕ: 12',
      speed: 'СКОРОСТ: 30',
      attack: 'АТАКА: 1.5',
      poison: 'ОТРОВА: БЕЗ ОТРОВА'
    },
    seller: {
      name: 'ИМЕ: Продавач',
      health: 'ПРЕДМЕТ: Здраве+1',
      speed: 'ПРЕДМЕТ: Скорост+10',
      attack: 'ПРЕДМЕТ: Броня+1',
    },
    mission: {
      name: 'ИМЕ: Мисия',
      health: 'ИЗПЪЛНИ МИСИЯ',
      speed: 'ЗА ДА ПОЛУЧИШ МОНЕТИ',
      attack: 'И ДА ОТКЛЮЧИШ БОСА',
      poison: ''
    },
  },
  back: "НАЗАД",
}


const optionsText = {
  EN,
  BG,
};

export default optionsText;
