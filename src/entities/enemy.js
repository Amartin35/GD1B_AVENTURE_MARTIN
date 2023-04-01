
export class Zombie1 extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'zombie1');
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(32, 44);
    this.body.setOffset(0, 21);

    this.setRandomSkin();
  }

  init(data){ 
    
    this.hpData = data.hp; 
    this.hasArmeData = data.arme;
    this.hasDashData = data.dash;
    this.moneyData = data.money;
    this.dropBossData = data.dropBoss;

    console.log(player.hp, "hp");
    console.log(data.arme ? "a  arme" :"n'a pas l'arme");
    console.log(data.dash ? "a  dash" :"n'a pas le dash");
    console.log(data.money, "money");
    console.log(data.dropBoss ? "a  le drop du boss" :"n'a pas le drop du boss");
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
        player.hp -= 1;
        player.degats();
  
        player.isInvincible = true; // Rend le joueur invincible
        setTimeout(() => {
          player.isInvincible = false; // Rend le joueur vulnérable 
        }, PLAYER_INVINCIBLE);
        
        console.log(player.hp, "hp");
        
        // Vérifie si le joueur est mort
        if (player.hp == 0) {
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
      // Détermine la direction dans laquelle le zombie doit se déplacer pour éviter la collision avec l'autre zombie
      let vecteurDeplacement = new Phaser.Math.Vector2(0, 0);
      vecteurDeplacement.setTo(zombie.x - otherZombie.x, zombie.y - otherZombie.y);
      vecteurDeplacement.normalize();
  
      // Déplace le zombie dans la direction opposée à l'autre zombie
      zombie.body.setVelocity(
        vecteurDeplacement.x * ZOMBIE_SPEED,
        vecteurDeplacement.y * ZOMBIE_SPEED
      );
    });
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
      this.body.setVelocity(
        vecteurDeplacement.x * ZOMBIE_SPEED,
        vecteurDeplacement.y * ZOMBIE_SPEED
      );
  
      // Détection des collisions entre le zombie et le joueur
      this.overlapPlayer(player);
  
      // Détection des collisions entre les zombies
      this.overlapEnemies(enemies);
    } else {
      this.body.setVelocity(0, 0);
    }
  }
}
