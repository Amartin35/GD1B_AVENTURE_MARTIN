
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); 
        this.clavier = scene.input.keyboard.createCursorKeys();
        

        scene.physics.world.enable(this)
        scene.add.existing(this)
        this.setCollideWorldBounds(true);

    }


    create(){

    }

    
    update(){
        var mouvement = new Phaser.Math.Vector2(0, 0)
        /// POUR DASH
        const aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const isAJustDown = Phaser.Input.Keyboard.JustDown(aKey); 


        

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

        if (isAJustDown) {
                    /// A FAIRE DASH
        } 
       

        
        
        mouvement.normalize();
        
        
        this.setVelocity(mouvement.x*PLAYER_SPEED, mouvement.y*PLAYER_SPEED);
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }
}