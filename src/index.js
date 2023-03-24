import Spawn_map from "./niveaux/Spawn_map.js";
import Hub from "./niveaux/Hub.js";
import Egout from "./niveaux/Egout.js";


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
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [Spawn_map, Hub, Egout]
};

// création et lancement du jeu à partir de la configuration config
var game = new Phaser.Game(config);
game.scene.start("Spawn_map"); // lancement de la scene selection
