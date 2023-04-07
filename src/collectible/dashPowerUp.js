export default class DashPowerUp extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setSize(35, 35);
        this.createAnimationsDashPowerUp();
    }

    createAnimationsDashPowerUp(){
        this.anims.create({
            key: 'IdleDashPowerUp',
            frames: this.anims.generateFrameNumbers("dashPowerUp", { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.play("IdleDashPowerUp", true);
    }

    collectDashPowerUp() {
        window.myGameValues.hasDashValues = true;
        console.log( window.myGameValues.hasDashValues);
        this.destroy();
    }
}    