import { Dimensions } from "react-native";
import { Flame, Water } from "./renderers";
import Matter from "matter-js";
import { Bonus1, Bonus2, Bonus3, Bonus4, Bonus5 } from "./Bonuses"

let timer = 0;
let iter = 0;
let fireId = 0;
let gameOver = false;

let countFire = 0;

let poisonEnabled = false;
let pause = false;
const gameOverCount = 50;
const poisonKey = "poison";

const { width, height } = Dimensions.get("window");
const flameSize = Math.trunc(Math.max(width, height) * 0.075);
const flameRectangle = Matter.Bodies.rectangle(width / 2, -1000, flameSize, flameSize, { frictionAir: 0.021 });

const field = {
  x0: 0,
  y0: flameSize,
  x1: width,
  y1: height - flameSize * 2
}

const randomInteger = (min, max) => {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

export const Init = (difficulty) => {
  gameOver = false;
  fireId = 0;
  iter = 0;
  timer = 0;
  countFire = 0;
  poisonEnabled = false;
  var dif = 0;
  switch (difficulty) {
    case "easy":
      dif = 1;
      break;
    case "normal":
      dif = 2;
      break;
    case "hard":
      dif = 3;
      break;
    default:
      dif = 1;
  }
  iter = 30 / dif;
}

export const TimerFunc = () => {
  if (gameOver) {
    return;
  }
  timer++;
  setTimeout(TimerFunc, 10);
}

const GameOverFunc = (state) => {
  if (countFire >= gameOverCount) {
    state.gameOver.gameOver = gameOver = true;
  }
  return state;
}

const CreateFireTimer = (state) => {
  if (gameOver){
    return state;
  }
  const ip = iter - Math.round(state.score.sum / 50);
  const dif = ip <= 0 ? 1 : ip;
  if (timer % dif == 0) {
    CreateFire(state);
  }
	return state;
};

const CreateFire = (state) => {
  if (pause) {
    return state;
  }
  const world = state["physics"].world;
  Matter.World.add(world, [flameRectangle]);
  var flameKey = "flame" + fireId;
  ++fireId;
  let flamelvl;
  if (!poisonEnabled && Math.random() < 0.1) {
    flamelvl = 3;
    poisonEnabled = true;
    flameKey = poisonKey;
  } else {
    flamelvl = state.score.sum > 500 ? randomInteger(1, 2) : 1;
  }
  state[flameKey] = { 
    body: flameRectangle, 
    flameSize: flameSize,
    posX: (field.x1 - field.x0 - flameSize) * Math.random(), 
    posY: flameSize + (field.y1 - field.y0 - flameSize) * Math.random(), 
    flameRate: randomInteger(1, 6),
    flamelvl: flamelvl, 
    renderer: Flame 
  }

  countFire++;

	return state;
};

const AddWater = (state, world, flame) => {
  Matter.World.add(world, [flameRectangle]);
  state["water"] = { 
    body: flameRectangle, 
    flameSize: flameSize,
    posX: flame.posX, 
    posY: flame.posY, 
    renderer: Water 
  }
}

const RemoveWater = (state, world, flamekey) => {
  if (state.water) {
    Matter.Composite.remove(world, state.water.body);
    delete state.water;
  }
}

const RemoveFire = (state, count) => {
  if (gameOver) {
    return state;
  }
  const world = state["physics"].world;
  Object.keys(state).filter(key => {
    if (key.includes("flame")) {
        return true;
    }
    return false;
  })
  .sort((a, b) => {
     if (state[a].flameRate < state[b].flameRate) {
       return 1;
     } else {
       return -1;
     }
  })
  .slice(0, count)
  .forEach(el => {
    Matter.Composite.remove(world, state[el].body);
    delete state[el];
    countFire--;
  });
return state;
};

const PutOutFire = (state, { touches, screen }) => {	
  if (gameOver) {
    return state;
  }
  const world = state["physics"].world;
  RemoveWater(state, world);

  const start = touches.find(x => x.type === "start");
  if (start) {
    
    const touchX = start.event.pageX;
    const touchY = start.event.pageY;

    let error = false;

    const flameId = Object.keys(state).find(key => {
      if (key.includes("flame") || key == poisonKey) {
        const flame = state[key];
        if (flame) {
          const flameX = flame.posX;
          const flameSize = flame.flameSize;
          if (flameX <= touchX && touchX <= flameX + flameSize) {
            const flameY = flame.posY;
            if (flameY <= touchY && touchY <= flameY + flameSize) {

              AddWater(state, world, flame);

              if (key == poisonKey) {
                state.bonus.sum -= 100;
                Matter.Composite.remove(world, state[poisonKey].body);
                delete state[poisonKey];
                poisonEnabled = false;

                countFire--;

                return state;
              }

              var flameRate = --flame.flameRate;
              if (flameRate == 0) {
                Matter.Composite.remove(world, state[key].body);
                IncreaseScore(state, state[key]);
                delete state[key];

                countFire--;

                if(poisonEnabled &&  Math.random() < 0.1) {
                  Matter.Composite.remove(world, state[poisonKey].body);
                  IncreaseScore(state, state[poisonKey]);
                  delete state[poisonKey];
                  poisonEnabled = false;

                  countFire--;
                }
              }
            } else {
              error = true;
            }
          } else {
            error = true;
          }
        }
      }
    });

    if (iter == 10 && error) {
      CreateFire(state);
    }
  }
	return state;
};

const PutBonus = (state, { touches, screen }) => {	
  if (gameOver){
    return state;
  }
  const start = touches.find(x => x.type === "start");
  if (start) {
    if (state.bonus.sum <= 0) {
      return state;
    }
    const touchY = start.event.pageY;
    if (touchY >= height - flameSize * 1.5 && touchY <= height) {
      const touchX = start.event.pageX;
      if (touchX >= 0 && touchX <= flameSize) {
        UseBonus(state, Bonus1);
      }
      else if (touchX >= flameSize * 1.5 && touchX <= flameSize * 2.5) {
        UseBonus(state, Bonus2);
      }
      else if (touchX >= flameSize * 3 && touchX <= flameSize * 4) {
        UseBonus(state, Bonus3);
      }
      else if (touchX >= flameSize * 4.5 && touchX <= flameSize * 5.5) {
        UseBonus(state, Bonus4);
      }
      else if (touchX >= flameSize * 6 && touchX <= flameSize * 7) {
        UseBonus(state, Bonus5);
      }
    }
  }
return state;
};

const UseBonus = (state, bonus) => {
  if (state.bonus.sum < bonus.cost) {
    return;
  }
  state.bonus.sum -= bonus.cost;

  for(let i=0; i <= bonus.addFire; i++) {
    CreateFire(state);
  }

  if (bonus.delay) {
    pause = true;
    setTimeout(() => {
      pause = false;
    }, bonus.delay * 1000);
  }

  RemoveFire(state, bonus.removeFire);

  state.score.sum += bonus.addBonus;
}

const IncreaseScore = (state, flame) => {
  [state.score, state.bonus].forEach(id => {
    var score = id;
    if (flame.flamelvl) {
      switch(flame.flamelvl){
        case 1:{
          score.sum += 10;
          break;
        }
        case 2: {
          score.sum += 20;
          break;
        }
        case 3: {
          score.sum += 100;
          break;
        }
        default : {
          score.sum += 10;
          break;
        }
      }
    } else {
      // нет уровня огня?
    }
  });
}

export { CreateFireTimer, PutOutFire, PutBonus, GameOverFunc };
