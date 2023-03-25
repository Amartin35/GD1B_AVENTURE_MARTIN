export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); 
        this.clavier = scene.input.keyboard.createCursorKeys();
        
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        
        // Propriétés du dash
        this.dashTime = 0;
        this.isDashing = false;
        this.dashCooldown = 0;
        this.dashCooldownMax = 50;
        this.dashDuration = 7;
        this.dashSpeed = 600;
        this.direction = "right"; 
        
    }
    
    update(time, delta) {

        var mouvement = new Phaser.Math.Vector2(0, 0);

        if (this.clavier.left.isDown) {
            mouvement.x = -1;
            this.direction = "left"; 
        } 
        else if (this.clavier.right.isDown) {
            mouvement.x = 1;
            this.direction = "right"; 
        } 
        else {
            mouvement.x = 0;
        }
        
        if (this.clavier.up.isDown) {
            mouvement.y = -1;
            this.direction = "up"; 
        } 
        else if (this.clavier.down.isDown) {
            mouvement.y = 1;
            this.direction = "down"; 
        } 
        else {
            mouvement.y = 0;
        }
        
        mouvement.normalize();
        this.setVelocity(mouvement.x * PLAYER_SPEED, mouvement.y * PLAYER_SPEED);

        if (mouvement.x < 0) {
            this.flipX = true;
        }
        else if (mouvement.x > 0) {
            this.flipX = false;
        }


        console.log(this.isDashing);
        // Gestion du dash
        if (this.clavier.space.isDown && this.dashCooldown <= 0 && this.isDashing == false) {
            this.isDashing = true;
            this.dashTime = 0;
        }

        // Vérifie si le joueur est en train de dasher
        if (this.isDashing) {
            // Met à jour le temps de dash et détermine s'il est terminé
            if(this.direction == "left" || this.direction == "right" ){
                this.setVelocityX(this.dashSpeed * (this.direction == "left" ? -1 : 1));
            }else{
                this.setVelocityY(this.dashSpeed * (this.direction == "up" ? -1 : 1));
            }


            this.dashTime += 1;
            if (this.dashTime >= this.dashDuration) {
                this.resetDash(); 
            }
        }

        // Vérifie si le dash est prêt à être utilisé à nouveau
        if (this.dashCooldown > 0) {
            this.dashCooldown -= 1;
        }
        
        
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    resetDash(){
        this.isDashing = false;
        this.dashTime = 0;
        this.dashCooldown = this.dashCooldownMax;
    }
}

