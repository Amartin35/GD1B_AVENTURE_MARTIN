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
        this.dashCooldownMax = 1000;
        this.dashDuration = 200;
        this.dashSpeed = 1000;
    }
    
    update(time, delta) {
        var mouvement = new Phaser.Math.Vector2(0, 0);

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
        this.setVelocity(mouvement.x * PLAYER_SPEED, mouvement.y * PLAYER_SPEED);


        console.log(this.isDashing);
        // Gestion du dash
        if (this.clavier.space.isDown && this.dashCooldown <= 0 && this.isDashing == false) {
            this.isDashing = true;
            this.dashTime = 0;
            this.setVelocityX(this.dashSpeed * (mouvement.x !== 0 ? mouvement.x : this.flipX ? -1 : 1));
        }

        // Vérifie si le joueur est en train de dasher
        if (this.isDashing) {
            // Met à jour le temps de dash et détermine s'il est terminé
            this.dashTime += 1;
            console.log(this.dashTime);
            if (this.dashTime >= this.dashDuration) {
                this.isDashing = false;
                this.dashTime = 0;
                this.dashCooldown = this.dashCooldownMax;
            }
        }

        // Vérifie si le dash est prêt à être utilisé à nouveau
        if (this.dashCooldown > 0) {
            this.dashCooldown -= 1;
        }
        
        // Mouvement du joueur
        if (!this.isDashing) {
            if (mouvement.x < 0) {
                this.setVelocityX(-PLAYER_SPEED);
                this.flipX = true;
            }
            else if (mouvement.x > 0) {
                this.setVelocityX(PLAYER_SPEED);
                this.flipX = false;
            }
            else {
                this.setVelocityX(0);
            }

            if (mouvement.y < 0) {
                this.setVelocityY(-PLAYER_SPEED);
            }
            else if (mouvement.y > 0) {
                this.setVelocityY(PLAYER_SPEED);
            }
            else {
                this.setVelocityY(0);
            }
        }
        
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }
}

