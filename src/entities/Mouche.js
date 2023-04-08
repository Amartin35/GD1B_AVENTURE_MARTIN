export default class Mouche extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      
      // Ajoute l'animation de la mouche
      scene.anims.create({
        key: 'fly',
        frames: scene.anims.generateFrameNumbers("mouche", { start: 0, end: 4 }),
        frameRate: 8,
        repeat: -1
      });
      
      this.anims.play('fly', true);
      scene.add.existing(this);
    }
  }