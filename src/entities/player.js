
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); 
        this.clavier = scene.input.keyboard.createCursorKeys();
        
        console.log(this)
        scene.physics.world.enable(this)
        scene.add.existing(this)
        this.setCollideWorldBounds(true);

    }
    
    update(){
        var mouvement = new Phaser.Math.Vector2(0, 0)
        
        if (this.clavier.left.isDown) {
            mouvement.x = -1;
        } 
        else if (this.clavier.right.isDown) {
            mouvement.x = 1;
        } 
        else {
            mouvement.x = 0;
        }

        if (this.clavier.up.isDown) {
            mouvement.y = -1;
        } 
        else if (this.clavier.down.isDown) {
            mouvement.y = 1;
        } 
        else {
            mouvement.y = 0;
        }

        mouvement.normalize();
        
        this.setVelocity(mouvement.x*PLAYER_SPEED, mouvement.y*PLAYER_SPEED);
    }
}