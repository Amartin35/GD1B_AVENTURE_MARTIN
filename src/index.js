import Selection from "./src/js/selection.js";
import Hub from "./src/js/Hub.js";
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
        y: 300 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [Selection, Hub]
};

// création et lancement du jeu à partir de la configuration config
var game = new Phaser.Game(config);
game.scene.start("Selection"); // lancement de la scene selection




