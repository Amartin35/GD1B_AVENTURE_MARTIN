import Spawn_map from "./niveaux/Spawn_map.js";
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
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [Spawn_map, Hub, Egout]
};

// création et lancement du jeu à partir de la configuration config
var game = new Phaser.Game(config);
game.scene.start("Spawn_map"); // lancement de la scene selection


function controlPlayer(player, cursors, attackHitbox){

  player.body.velocity.normalize()
//DEPLACEMENTS ET ANIMATIONS JOUEUR
  if (cursors.up.isDown) {
      player.setVelocityY(-player.speed); 
      player.anims.play(player.currentAnims[1], true); 
      player.dir = "up";
      
  }
  else if (cursors.down.isDown) {       
      player.setVelocityY(player.speed); 
      player.anims.play(player.currentAnims[3], true); 
      player.dir = "down";     
  }
  else if (cursors.left.isDown) { 
      player.setVelocityX(-player.speed); 
      player.anims.play(player.currentAnims[0], true); 
      player.dir = "left";
  }
  else if (cursors.right.isDown) { 
      player.setVelocityX(player.speed); 
      player.anims.play(player.currentAnims[2], true); 
      player.dir = "right";
  }
  else {  // ANIMATIONS JOUEUR IDLE
      player.setVelocityX(0); 
      player.setVelocityY(0); 
      if(player.dir == "down"){
          player.anims.play(player.currentAnims[7]); 
      }
      else if(player.dir == "up"){
          player.anims.play(player.currentAnims[5]);
      }
      else if(player.dir == "left"){
          player.anims.play(player.currentAnims[4]);
      }
      else if(player.dir == "right"){
          player.anims.play(player.currentAnims[6]);
      }
      
  }  