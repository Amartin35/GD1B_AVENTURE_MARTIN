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
		this.CreateAnimationsBarreHp();
		this.CreateAnimationsMonaieHud();
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
		
		// vie et frame d'invu
		this.isInvincible = false;
		this.degats();
		
		this.body.setSize(20, 20);
		this.body.setOffset(7, 43);
		
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
	
	update() {
		
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
		
		
		
		
		
		
		// Condition de frappe avec une arme
		if ((this.clavier.attack.isDown || this.pad?.B)&& window.myGameValues.hasArmeValues && this.attackCooldown <= 0) {
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
		if ((this.clavier.space.isDown || this.pad?.X) && window.myGameValues.hasDashValues == true && this.dashCooldown <= 0 && this.isDashing == false) {
			this.isDashing = true;
			this.dashTime = 0;
			this.isInvincible = true; // Rend le joueur invincible
			setTimeout(() => {
				this.isInvincible = false; // Rend le joueur vulnérable 
			}, PLAYER_INVINCIBLE);
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
		
		this.degats();
		this.MonaieHud();
	}
	






	attack() {
		let x_offset = 0;
		let y_offset = 0;
		let angle = 0; 
		let sizeX = 64;
		let sizeY = 96;
		let soundAttack = this.scene.sound.add('attackSound'); 
		
		if (this.direction === "left") {
			x_offset = -45;
			angle = 180;
		} else if (this.direction === "right") {
			x_offset = 45;
			angle = 0;
		} else if (this.direction === "up") {
			y_offset = -45;
			angle = -90;
			sizeX = 96;
			sizeY = 64;
		} else if (this.direction === "down") {
			y_offset = 45;
			angle = 90;
			sizeX = 96;
			sizeY = 64;
		}
		
		const bullet = this.scene.physics.add.sprite(this.x + x_offset, this.y + y_offset, 'bullet', 0).setSize(sizeX, sizeY);
		bullet.setAngle(angle);
		setTimeout(() => { bullet.destroy(); }, 80);
		
		// Détecte la collision avec l'ennemi
		this.scene.physics.add.overlap(bullet, this.scene.enemies, (bullet, enemy) => {
			// Appel de la méthode de dégâts sur l'ennemi
			enemy.kill();
			
			// Détruie l'arme
			bullet.destroy();
		});
		soundAttack.play();
		
		// Détecte la collision avec le boss
		this.scene.physics.add.overlap(bullet, this.scene.boss, (bullet, boss) => {
			// Applique les dégâts au boss
			boss.takeDamage();
			console.log("boss toucher");
			
			// Détruire l'arme
			bullet.destroy();
		});
		soundAttack.play();
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
			frameRate: 8,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'IdleUp',
			frames: this.scene.anims.generateFrameNumbers('perso', {start:4, end:7}),
			frameRate: 8,
			repeat: -1
		});
		
		this.scene.anims.create({
			key: 'MoveDown',
			frames: this.scene.anims.generateFrameNumbers('perso', {start:8, end:11}),
			frameRate: 8,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'MoveUp',
			frames: this.scene.anims.generateFrameNumbers('perso', {start:12, end:15}),
			frameRate: 8,
			repeat: -1
		});
	}
	

	CreateAnimationsMonaieHud(){
		this.scene.anims.create({
			key: 'MonaieHud1',
			frames:[{key: 'HudMonaie', frame: 0}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'MonaieHud2',
			frames:[{key: 'HudMonaie', frame: 1}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'MonaieHud3',
			frames:[{key: 'HudMonaie', frame: 2}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'MonaieHud4',
			frames:[{key: 'HudMonaie', frame: 3}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'MonaieHud5',
			frames:[{key: 'HudMonaie', frame: 4}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'MonaieHud6',
			frames:[{key: 'HudMonaie', frame: 5}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'MonaieHud7',
			frames:[{key: 'HudMonaie', frame: 6}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'MonaieHud8',
			frames:[{key: 'HudMonaie', frame: 7}],
			frameRate: 10
		});
	}


	CreateAnimationsBarreHp(){
		this.scene.anims.create({
			key: 'hp5',
			frames:[{key: 'healtbar', frame: 0}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'hp4',
			frames:[{key: 'healtbar', frame: 1}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'hp3',
			frames:[{key: 'healtbar', frame: 2}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'hp2',
			frames:[{key: 'healtbar', frame: 3}],
			frameRate: 10
		});
		this.scene.anims.create({
			key: 'hp1',
			frames:[{key: 'healtbar', frame: 4}],
			frameRate: 10
		});
	}
	

	degats(){
		if (this.healthBar && window.myGameValues.hpValues == 5) {
			this.healthBar.anims.play("hp5", true);
		}
		
		if (this.healthBar && window.myGameValues.hpValues == 4) {
			this.healthBar.anims.play("hp4", true);
		}
		
		if (this.healthBar && window.myGameValues.hpValues == 3) {
			this.healthBar.anims.play("hp3", true);
		}
		
		if (this.healthBar && window.myGameValues.hpValues == 2) {
			this.healthBar.anims.play("hp2", true);
		}
		
		if (this.healthBar && window.myGameValues.hpValues == 1) {
			this.healthBar.anims.play("hp1", true);
		}
	}
	
	
	MonaieHud(){
		if (this.HudMonaie && window.myGameValues.moneyValues == 0) {
			this.HudMonaie.anims.play("MonaieHud1", true);
			this.HudMonaie.visible = false;
		}
		if (this.HudMonaie && window.myGameValues.moneyValues == 1) {
			this.HudMonaie.anims.play("MonaieHud1", true);
			this.HudMonaie.visible = true;
		}
		if (this.HudMonaie && window.myGameValues.moneyValues == 2) {
			this.HudMonaie.anims.play("MonaieHud2", true);
		}
		
		if (this.HudMonaie && window.myGameValues.moneyValues == 3) {
			this.HudMonaie.anims.play("MonaieHud3", true);
		}
		
		if (this.HudMonaie && window.myGameValues.moneyValues == 4) {
			this.HudMonaie.anims.play("MonaieHud4", true);
		}
		
		if (this.HudMonaie && window.myGameValues.moneyValues == 5) {
			this.HudMonaie.anims.play("MonaieHud5", true);
		}
		
		if (this.HudMonaie && window.myGameValues.moneyValues == 6) {
			this.HudMonaie.anims.play("MonaieHud6", true);
		}
		
		if (this.HudMonaie && window.myGameValues.moneyValues == 7) {
			this.HudMonaie.anims.play("MonaieHud7", true);
		}
		
		if (this.HudMonaie && window.myGameValues.moneyValues == 8) {
			this.HudMonaie.anims.play("MonaieHud8", true);  
		}
	}
}

