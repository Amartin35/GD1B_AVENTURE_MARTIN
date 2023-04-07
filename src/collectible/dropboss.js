export default class Dropboss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setSize(35, 35);
       this.createAnmationDropBoss();
    }
    
    createAnmationDropBoss(){
        this.scene.anims.create({
            key: 'IdleDropBoss',
            frames: this.scene.anims.generateFrameNumbers('DropBossSprite', { start: 0, end: 5 }),
            frameRate: 7,
            repeat: -1
          });
      
        this.anims.play('IdleDropBoss');
    }

}    
