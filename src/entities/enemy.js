export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.immovable = true;

      }
  
    update() {
      // ajoutez ici le code pour mettre à jour le comportement de l'ennemi
    }
  }