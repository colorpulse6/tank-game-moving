import * as PIXI from "pixi.js";
import {bgTexture,
  bulletTexture,
  hayTexture,
  wallTexture,
  redTankTexture,
  greenTankTexture,
  blueTankTexture,} from "./textures"

const canvas = document.getElementById("my-canvas") as HTMLCanvasElement;

let _w = window.innerWidth;
let _h = window.innerHeight;

//PIXI application helper class
let app = new PIXI.Application({
  view: canvas,
  width: _w,
  height: _h,
});


const screenWidth = app.renderer.screen.width;
const screenHeight = app.renderer.screen.height;

//Creat container for tank(necesary for rotation)

let tankContainer = new PIXI.Container();

//Create sprites
let bg = new PIXI.Sprite(bgTexture);
let bullet = new PIXI.Sprite(bulletTexture);
let redTank = new PIXI.Sprite(redTankTexture);
let greenTank = new PIXI.Sprite(greenTankTexture);
let blueTank = new PIXI.Sprite(blueTankTexture);

let tanks = [redTank, greenTank, blueTank]

tanks.map((tank)=>{
  tank.height = 70
  tank.width = 70
})

//Set tank names for conditional
redTank.name = "redTank";
greenTank.name = "greenTank";
blueTank.name = "blueTank";
bg.width = screenWidth;
bg.height = screenHeight;
bullet.width = 30;
bullet.height = 30;
bullet.name = "bullet";

app.stage.addChild(bg);

//Set Image to Center
bg.x = screenWidth / 2;
bg.y = screenHeight / 2;
bg.anchor.x = 0.5;
bg.anchor.y = 0.5;

//Set initial tank
let activeTank = redTank;

activeTank.x = screenWidth / 2;
activeTank.y = screenHeight - 100;

//Add to container
app.stage.addChild(tankContainer);

tankContainer.addChild(activeTank);
tankContainer.x = activeTank.x;
tankContainer.y = activeTank.y;
tankContainer.name = "activeTank";
tankContainer.pivot.x = activeTank.x + 25;
tankContainer.pivot.y = activeTank.y + 25;

//Set initial tank coords on load
let tankPos = {
  x: activeTank.x,
  y: activeTank.y,
};

const toggleTank = () => {
  tankContainer.removeChild(activeTank);
  switch (activeTank.name) {
    case "redTank":
      activeTank = blueTank;
      break;
    case "blueTank":
      activeTank = greenTank;
      break;
    case "greenTank":
      activeTank = redTank;
  }
  activeTank.x = tankPos.x;
  activeTank.y = tankPos.y;

  tankContainer.addChild(activeTank);
};

//Declare type for obstacle
type obsElement = {
  sprite: PIXI.Sprite;
  health: number;
};

let hayArray: Array<obsElement> = [];
let wallArray: Array<obsElement> = [];


const addObs = (name: string, texture: PIXI.Texture) => {
  let obsElement: obsElement;

  //Create Hay
  obsElement = { sprite: new PIXI.Sprite(texture), health: 100 };

  obsElement.sprite.x = Math.floor(Math.random() * screenWidth) + 50;
  obsElement.sprite.y = -50;
  obsElement.sprite.width = 50;
  obsElement.sprite.height = 50;


  obsElement.sprite.name = name;
  app.stage.addChild(obsElement.sprite);
  if (name === "hay") {
    hayArray.push(obsElement);
  }
  if (name === "wall") {
    wallArray.push(obsElement);
  }
};

let spawnRate = 2500;
let lastSpawn = -10;
let rateOfDescent = 0.7;

const makeFall = () => {

  //Spread item
  var time = Date.now();
  if (time > lastSpawn + spawnRate) {
    lastSpawn = time;
    addObs("hay", hayTexture);
    addObs("wall", wallTexture);
  }

  handleObstacle(hayArray);
  handleObstacle(wallArray);
};

//Make item fall
function handleObstacle(array: Array<obsElement>) {
  for (let i = 0; i < array.length; i++) {
    let eachItem = array[i].sprite;
    let eachObject = array[i];
    eachItem.y += rateOfDescent;

    //Remove item from array on exit
    if (eachItem.y >= screenHeight + 50) {
      handleExitObs(eachObject, array);
    }
    handleBullets(eachObject);
    detectCollision(activeTank, eachItem);
  }
}
let bullets: Array<PIXI.Sprite> = [];
let bulletSpeed = 5;

let count = 0;

//Collision detection (for bullets)
function collision(obs1:PIXI.Sprite, obs2:PIXI.Sprite){
  return obs2.x + obs2.width > obs1.x &&
  obs2.x < obs1.x + obs1.width &&
  obs2.y + obs2.height > obs1.y &&
  obs2.y < obs1.y + obs1.height
}

function detectHit(obs1: PIXI.Sprite, obs2: obsElement) {
  if (collision(obs1, obs2.sprite)) {

    //Remove bullets on target hit
    handleExitBullets(obs1, bullets);

    //Remove health
    if (obs2.sprite.name === "hay") {
      switch (activeTank.name) {
        case "redTank":
          obs2.health -= 10;
          break;
        case "blueTank":
          obs2.health -= 20;
          break;
        case "greenTank":
          obs2.health -= 25;
          break;
      }
    }
  }

  //Remove dead targets
  if (obs2 && obs2.health === 0) {
    count++;
    handleExitObs(obs2, hayArray);
  }

  //Set score
  let score = document.getElementById("score") as HTMLElement;
  score.innerHTML = `Score: ${String(count)}`;
}

//Collision detection (for tank)
function detectCollision(obs1: PIXI.Sprite, obs2: PIXI.Sprite) {
  if (collision(obs1, obs2)) { 
    //Check for tank collision
    obs1.y = obs2.y + obs2.height;
  }
}

//Render Bullets
function shoot(rotation: number, startPosition: { x: number; y: number }) {
  app.stage.addChild(bullet);
  bullet.x = startPosition.x - 15;
  bullet.y = startPosition.y - 25;
  bullet.rotation = rotation;
  bullets.push(bullet);
}

function handleBullets(eachHay: obsElement) {

  //Control Bullets
  for (var k = 0; k < bullets.length; k++) {
    let eachBullet = bullets[k];

    //Rotate bullet pos with tank
    eachBullet.position.x += eachBullet.rotation * bulletSpeed;
    eachBullet.position.y +=
      -Math.abs(Math.cos(eachBullet.rotation)) * bulletSpeed;

    //Remove Bullet from array on exit
    if (eachBullet && eachBullet.y <= 0) {
      handleExitBullets(eachBullet, bullets);
    }
    detectHit(eachBullet, eachHay);
  }
}

function handleExitBullets(item: PIXI.Sprite, array: Array<PIXI.Sprite>) {
  app.stage.removeChild(item);
  array.splice(array.indexOf(item), 1);
}

function handleExitObs(item: obsElement, array: Array<obsElement>) {
  app.stage.removeChild(item.sprite);
  array.splice(array.indexOf(item), 1);
}

//Handle Controls
const onKeyDown = (e: KeyboardEvent) => {
  switch (e.code) {
    case "ArrowRight":
      activeTank.x += 25;

      //Set moving tank coords
      tankPos.x = activeTank.x;
      tankContainer.pivot.x = activeTank.x + 25;
      tankContainer.x = activeTank.x;
      break;
    case "ArrowLeft":
      activeTank.x -= 25;
      tankPos.x = activeTank.x;
      tankContainer.pivot.x = activeTank.x + 25;
      tankContainer.x = activeTank.x;

      break;
    case "ArrowUp":
      activeTank.y -= 25;
      tankPos.y = activeTank.y;
      tankContainer.pivot.y = activeTank.y + 25;
      tankContainer.y = activeTank.y;
      break;
    case "ArrowDown":
      activeTank.y += 25;
      tankPos.y = activeTank.y;
      tankContainer.pivot.y = activeTank.y + 25;
      tankContainer.y = activeTank.y;
      break;
    case "KeyQ":
      tankContainer.rotation -= 0.1;
      break;
    case "KeyW":
      tankContainer.rotation += 0.1;
      break;
    case "KeyT":
      toggleTank();
      break;
    case "Space":
      shoot(tankContainer.rotation, {
        x: tankContainer.x,
        y: tankContainer.y,
      });
      break;
  }
  //Prevent tank from rotating past its x axis
  if (tankContainer.rotation < -1.6) {
    tankContainer.rotation = -1.6;
  }
  if (tankContainer.rotation > 1.6) {
    tankContainer.rotation = 1.6;
  }
};

document.addEventListener("keydown", onKeyDown);

const animate = () => {
  requestAnimationFrame(animate);
  makeFall();
};
animate();
