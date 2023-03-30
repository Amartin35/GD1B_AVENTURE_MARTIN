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

  // Rajoute un skin aléatoire entre 2
  setRandomSkin() {
    let randomSkin = Math.random();
    if (randomSkin > 0.5) {
      this.setTexture('zombie2');
    } else {
      this.setTexture('zombie1');
    }
  }

  // Gère la détection des collisions entre les zombies
  overlap(enemies) {
    this.scene.physics.overlap(this, enemies, (zombie, enemy) => {
      // Détermine la direction dans laquelle le zombie doit se déplacer pour éviter la collision avec l'autre zombie
      let vecteurDeplacement = new Phaser.Math.Vector2(0, 0);
      vecteurDeplacement.setTo(zombie.x - enemy.x, zombie.y - enemy.y);
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

      // Détection des collisions entre les zombies
      this.overlap(this.scene.enemies);
    } else {
      this.body.setVelocity(0, 0);
    }
  }
}
