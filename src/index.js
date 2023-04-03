import Spawn_map from "./niveaux/Spawn_map.js";
import Hub from "./niveaux/Hub.js";
import Egout from "./niveaux/Egout.js";
import Menu from "./niveaux/Menu.js";

var gameViewport = document.getElementById("game_viewport");

addEventListener("resize", onResizeWindow);
function onResizeWindow(){
    var gameZoomX = (window.innerWidth - (window.innerWidth % GAME_WIDTH)) / GAME_WIDTH;
    var gameZoomY = (window.innerHeight - (window.innerHeight % GAME_HEIGHT)) / GAME_HEIGHT;
    var gameZoom = gameZoomX < gameZoomY ? gameZoomX : gameZoomY;
    gameViewport.style.width = (GAME_WIDTH * gameZoom) + 'px';
}

onResizeWindow();

// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT, 
  parent: 'game_viewport',
  render: {
    antialias: false
  },
  pixelArt: true,
  physics: {
   
    default: "arcade", 
    arcade: {

      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    },
    input: {
      gamepad: true
    },
  },
  input: {
    gamepad: true // activer le support des manettes
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  scene: [Menu, Spawn_map, Hub, Egout]
};

var game = new Phaser.Game(config);
game.scene.start("Menu"); // lancement de la scene Menu


