export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); 
        this.clavier = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            attack: Phaser.Input.Keyboard.KeyCodes.V,
        });
        this.pad; // récupère la manette
        
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        
        
        // Propriétés des animations
        this.CreateAnimations();
        this.facingUp = false;
        
        // Propriétés du dash
        this.dashTime = 0;
        this.isDashing = false;
        this.dashCooldown = 0;
        this.dashCooldownMax = 50;
        this.dashDuration = 8;
        this.dashSpeed = 550;
        this.direction = "right"; 
        
        //Propriété de l'attaque
        this.attackTime = 0;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackCooldownMax = 30;
        this.attackDuration = 1;

    


        // resize collision 
        this.body.setSize(28, 28);
        this.body.setOffset(3, 35);
        
        // setup the controller connected/disconnected event
        this.scene.input.gamepad.on('connected', () => {
            this.pad = this.scene.input.gamepad.pad1;
            this.onGamepadConnect(this);
        });
        
        this.scene.input.gamepad.on('disconnected', this.onGamepadDisconnect, this);
        
        
    }
    onGamepadDisconnect(){
        console.log("Controller disconnected!");
    }
    onGamepadConnect(){
        console.log("Controller connected!");
        
    }
    
    update(time, delta) {
        
        // Vérifie si le gamepad est connecté
        if (this.scene.input.gamepad.total > 0) {
            this.pad = this.scene.input.gamepad.pad1; // récupère la manette
        }
        var mouvement = new Phaser.Math.Vector2(0, 0);
        // Mouvement
        if (this.clavier.left.isDown || this.pad?.left) {
            mouvement.x = -1;
            this.direction = "left"; 
        } 
        else if (this.clavier.right.isDown || this.pad?.right) {
            mouvement.x = 1;
            this.direction = "right"; 
        } 
        else {
            mouvement.x = 0;
            
        }
        
        if (this.clavier.up.isDown || this.pad?.up) {
            mouvement.y = -1;
            this.direction = "up"; 
            this.facingUp = true;
        } 
        else if (this.clavier.down.isDown || this.pad?.down) {
            mouvement.y = 1;
            this.direction = "down";
            this.facingUp = false;
            
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
        
        if(mouvement.length() != 0) {
            if(this.facingUp){
                this.anims.play("MoveUp",true);
            }
            else{
                this.anims.play("MoveDown",true);
            }
        }
        else{
            if(this.facingUp){
                this.anims.play("IdleUp",true);
            }
            else{
                this.anims.play("IdleDown",true);
            }
        }
        
        
        // Condition de frappe avec une arme RAJOUTER LA CONDITION THIS.HASARME
        if ((this.clavier.attack.isDown || this.pad?.B.isDown)&& this.attackCooldown <= 0) {
            console.log("Frapper avec une arme");
            this.isAttacking = true;
            this.attackTime = 0;
        }


        // Vérifie si le joueur est en train d'attaquer
        if(this.isAttacking) {
            this.attack();
         


            this.attackTime += 1;
            if (this.attackTime >= this.attackDuration) {
            this.resetAttack(); 
            }
        }

            
        // Vérifie si l'attaque est prête à être utilisée à nouveau
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }


        
        
       
        
        
        // Gestion du dash
        if ((this.clavier.space.isDown || this.pad?.A) && this.hasDash && this.dashCooldown <= 0 && this.isDashing == false) {
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
            this.dashCooldown--;
        }
        
        
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        
        
        
    }

    attack() {
        let x_offset = 0;
        let y_offset = 0;
        const diagonalAngle = 45 * Math.PI / 180; // convertir 45 degrés en radians pour la fonction Math.cos et Math.sin
    
        if (this.direction === "left") {
            x_offset = -45;
        } else if (this.direction === "right") {
            x_offset = 45;
        } else if (this.direction === "up") {
            y_offset = -45;
        } else if (this.direction === "down") {
            y_offset = 45;
        }
    
        if (x_offset !== 0 && y_offset !== 0) {
            // Si la balle est dans une direction diagonale, ajuster l'offset pour inverser la direction diagonale sur l'axe x
            const angle = Math.atan2(y_offset, x_offset);
            const distance = Math.sqrt(x_offset ** 2 + y_offset ** 2);
            x_offset = Math.cos(angle + diagonalAngle) * distance;
            y_offset = Math.sin(angle + diagonalAngle) * distance;
        }
    
        const bullet = this.scene.physics.add.sprite(this.x + x_offset, this.y + y_offset, 'bullet', 0).setSize(50, 50 );
        setTimeout(() => { bullet.destroy(); }, 20);

    }
    
    
    
    
    resetDash(){
        this.isDashing = false;
        this.dashTime = 0;
        this.dashCooldown = this.dashCooldownMax;
    }
    
    
    
    resetAttack(){
        this.isAttacking = false;
        this.attackTime = 0;
        this.attackCooldown = this.attackCooldownMax;
    }
    
    
    //Animations
    CreateAnimations(){
        
        this.scene.anims.create({
            key: 'IdleDown',
            frames: this.scene.anims.generateFrameNumbers('perso', {start:0, end:3}),
            frameRate: 4,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'IdleUp',
            frames: this.scene.anims.generateFrameNumbers('perso', {start:4, end:7}),
            frameRate: 4,
            repeat: -1
        });
        
        this.scene.anims.create({
            key: 'MoveDown',
            frames: this.scene.anims.generateFrameNumbers('perso', {start:8, end:11}),
            frameRate: 4,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'MoveUp',
            frames: this.scene.anims.generateFrameNumbers('perso', {start:12, end:15}),
            frameRate: 4,
            repeat: -1
        });
    }
}

