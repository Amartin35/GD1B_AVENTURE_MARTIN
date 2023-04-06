import RecupVie from "../collectible/recupVie.js";
import Player from "./player.js";
export default class Zombie1 extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type = "normal") {
    super(scene, x, y, 'zombie1');
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(32, 44);
    this.body.setOffset(0, 21);

    this.type = type;
    this.setRandomSkin();
    

  }


  // Rajoute un skin aléatoire entre 2
  setRandomSkin() {
    let randomSkin = Math.random();
    if (randomSkin > 0.5) {
      this.setTexture('zombie2');
    } else {
      this.setTexture('zombie1');
    }
  }



  overlapPlayer(player) {
    this.scene.physics.overlap(this, player, () => {
      if (!player.isInvincible) { // Vérifie si le joueur est invincible
        // Teinte le joueur en rouge
        player.setTint(0xff0000);
        
        setTimeout(() => {
          player.clearTint();
        }, 300);
  
        // Inflige des dégâts au joueur
        window.myGameValues.hpValues -= 1;
        player.degats();
        // Teinte le joueur en rouge
        player.setTint(0xff0000);

        setTimeout(() => {
          player.clearTint();
        }, 300);
  
  
        player.isInvincible = true; // Rend le joueur invincible
        setTimeout(() => {
          player.isInvincible = false; // Rend le joueur vulnérable 
        }, PLAYER_INVINCIBLE);
        
        console.log(window.myGameValues.hpValues, "hp");
        
        // Vérifie si le joueur est mort
        if (window.myGameValues.hpValues == 0) {
          this.scene.physics.pause();
          this.scene.cameras.main.fadeOut(FONDU_CAM); // Fondu de la caméra
          setTimeout(() => {
            
            this.scene.add.text(60, 120, "Vous êtes mort !", { font: "54px Arial", fill: "#FFFFFF" }).setScrollFactor(0); // Affichage du texte à la caméra
            setTimeout(() => {
              location.reload(); // Recharge la page apres un delai
            }, 3333); 
          }, 150); // Attends 150 milisecondes avant d'afficher le texte
        }
      }
    });
  }
  
  overlapEnemies(enemies) {
    this.scene.physics.overlap(this, enemies, (zombie, otherZombie) => {
      // Ne pousse pas l'autre zombie si c'est un zombie rapide
      if (otherZombie instanceof Zombie1 && otherZombie.type == "rapide") {
        return;
      }
  
      let vecteurDeplacement = new Phaser.Math.Vector2(0, 0);
      vecteurDeplacement.setTo(zombie.x - otherZombie.x, zombie.y - otherZombie.y);
      vecteurDeplacement.normalize();
  
      zombie.body.setVelocity(
        vecteurDeplacement.x * ZOMBIE_SPEED,
        vecteurDeplacement.y * ZOMBIE_SPEED
      );
    });
  }
  
  kill() {
    // Générer un nombre aléatoire entre 1 et 3
    const random = Phaser.Math.Between(1, 3);
  
    // Si le nombre aléatoire est égal à 1, créer le drop
    if (random === 1) {
      const drop = new RecupVie(this.scene, this.x, this.y, 'recupVie');
  
      this.scene.anims.create({
        key: 'IdleVIE',
        frames: this.scene.anims.generateFrameNumbers('recupVie', { start: 0, end: 3 }),
        frameRate: 7,
        repeat: -1
      });
  
      drop.anims.play('IdleVIE');
  
      // Vérifier si le joueur touche le sprite de récupération de vie
      this.scene.physics.add.overlap(drop, this.scene.player, () => {
        // Incrémenter la variable de points de vie
        window.myGameValues.hpValues += 1;
        // Détruire le sprite de récupération de vie
        drop.destroy();
      });
    }
  
    // Détruire l'objet courant
    this.destroy();
  }
  




  update() {
    const player = this.scene.player;
    const enemies = this.scene.enemies.getChildren();
  
    // Calcule la direction vers le joueur
    let vecteurDeplacement = new Phaser.Math.Vector2(0, 0);
    vecteurDeplacement.setTo(player.x - this.x, player.y - this.y);
  
    if (vecteurDeplacement.length() < ZOMBIE_RANGE) {
      vecteurDeplacement.normalize();
  
      // Déplace le zombie vers le joueur
      // Si le zombie est d etype rapide, on multiplie par 3 sa vitesse de deplacement
      if (this.type === "rapide") {
        this.body.setVelocity(
          vecteurDeplacement.x * ZOMBIE_SPEED * 3,
          vecteurDeplacement.y * ZOMBIE_SPEED * 3
        );

      // Sinon, il a la vitesse normale
      } else {
        this.body.setVelocity(
          vecteurDeplacement.x * ZOMBIE_SPEED,
          vecteurDeplacement.y * ZOMBIE_SPEED
        );
      }
      
  
      // Détection des collisions entre le zombie et le joueur
      this.overlapPlayer(player);
  
      // Détection des collisions entre les zombies
      this.overlapEnemies(enemies);
    } else {
      this.body.setVelocity(0, 0);
    }
  }
}


