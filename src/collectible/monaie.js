export default class Monaie extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setSize(32, 32);
        this.createAnimationsMonaie();
    }

    createAnimationsMonaie(){
        this.anims.create({
            key: 'IdleCapsule',
            frames: this.anims.generateFrameNumbers("monaie", { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.play("IdleCapsule", true);
    }

    collectmonaie() {
        window.myGameValues.moneyValues += 1;
        console.log( window.myGameValues.moneyValues,"money");
        this.destroy();
    }
}    
