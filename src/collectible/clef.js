export default class Clef extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setSize(35, 35);
        this.createAnimationsClef();
    }

    createAnimationsClef(){
        this.anims.create({
            key: 'Idle',
            frames: this.anims.generateFrameNumbers("clef", { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.play("Idle", true);
    }

    collect() {
        window.myGameValues.hasClefValues = true;
        this.destroy();
    }
}    
