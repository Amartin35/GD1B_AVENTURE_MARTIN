import QuartierChinois from "./niveaux/QuartierChinois.js";
import Hub from "./niveaux/Hub.js";
import Egout from "./niveaux/Egout.js";



// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 800, // largeur en pixels
  height: 600, // hauteur en pixels
  parent: 'game_viewport',
  render: {
    antialias: false
  },
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 400 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [QuartierChinois, Hub, Egout]
};

// création et lancement du jeu à partir de la configuration config
var game = new Phaser.Game(config);
game.scene.start("QuartierChinois"); // lancement de la scene selection




