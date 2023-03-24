
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
        // Propriétés du dash
        this.dashTime = 0;
        this.isDashing = false;
        this.dashCooldown = 0;
        this.dashDuration = 200;
        this.dashSpeed = 1000;
        
        
        
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
        




        // Vérifie si le joueur est en train de dasher
        if (isDashing) {
            // Met à jour le temps de dash et détermine s'il est terminé
            this.dashTime += game.time.elapsedMS;
            if (this.dashTime >= this.dashDuration) {
                this.isDashing = false;
                this.dashTime = 0;
                this.dashCooldown = this.dashCooldownMax;
            }
        }
        // Vérifie si le dash est prêt à être utilisé à nouveau
        if (this.dashCooldown > 0) {
            this.dashCooldown -= game.time.elapsedMS;
        }
        
        // Mouvement du joueur
        if (cursors.left.isDown) {
            this.setVelocityX(-160);

            if (!this.isDashing) {
                this.flipX = true;
            }
        } else if (cursors.right.isDown) {
            this.setVelocityX(160);

            if (!this.isDashing) {
                this.flipX = false;
            }
        } else {
            this.setVelocityX(0);
        }
        
        if (cursors.up.isDown) {
            this.setVelocityY(-350);
        }
        
        // Gestion du dash
        if (cursors.space.isDown && this.dashCooldown <= 0) {
            this.isDashing = true;
            this.setVelocityX(this.dashSpeed * (this.flipX ? -1 : 1));
        }
    
    
    
    
    
    
        mouvement.normalize();
        
        
        this.setVelocity(mouvement.x*PLAYER_SPEED, mouvement.y*PLAYER_SPEED);
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }
}