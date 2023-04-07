import Dropboss from "../collectible/dropboss.js";
export default class Boss extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, player) {
		super(scene, x, y, texture);
		this.scene = scene;
		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.body.setCollideWorldBounds(true);
		this.body.setSize(98, 98);
		this.player = player;
		this.phase = 1;
		this.maxHealth = BOSS_MAX_HEALT;
		this.health = this.maxHealth;
		this.moveSpeedPhase1 = BOSS_MOVE_SPEED_PHASE_1;
		this.moveSpeedPhase2 = BOSS_MOVE_SPEED_PHASE_2;
		this.playerDetectionDistance = BOSS_DETECTION_DISTANCE;
		this.startX = x;
		this.startY = y;
	}
	
	overlapBossPlayer() {
		this.scene.physics.overlap(this, this.player, () => {
			if (!this.player.isInvincible) { // Vérifie si le joueur est invincible
				this.hasBeenHit = true;
				
				
				// Inflige des dégâts au joueur
				window.myGameValues.hpValues -= 1;
				this.player.degats();
				
				
				this.player.isInvincible = true; // Rend le joueur invincible
				setTimeout(() => {
					this.player.isInvincible = false; // Rend le joueur vulnérable 
				}, PLAYER_INVINCIBLE);
				
				console.log(window.myGameValues.hpValues, "hp");
				
				// Vérifie si le joueur est mort
				if (window.myGameValues.hpValues == 0) {
					this.scene.physics.pause();
					this.scene.cameras.main.fadeOut(FONDU_CAM);
					setTimeout(() => {
						
						this.scene.add.text(60, 120, "Vous êtes mort !", { font: "54px Arial", fill: "#FFFFFF" }).setScrollFactor(0);
						setTimeout(() => {
							location.reload();
						}, 3333); 
					}, 150);
				}
			}
		});
	}
	
	takeDamage() {
		let soundMortBoss = this.scene.sound.add('BossMortSound');
		this.health -= 10;
		if (this.health <= 0) {
			
			
			const dropboss = new Dropboss(this.scene, this.x, this.y, 'DropBossSprite');
			
			// Vérifie si le joueur touche le sprite de récupération de vie
			this.scene.physics.add.overlap(dropboss, this.scene.player, () => {
				// Incrémente la variable de points de vie
				window.myGameValues.hasdropBossValues = true;
				dropboss.destroy();
			});
			
			this.destroy();
			soundMortBoss.play();
			soundMortBoss.setVolume(0.3);
		}
	}
	
	update() {
		
		// Vérifie si le boss est en vie
		if (!this.body) {
			return;
		}
		// Vérifie si le joueur est à portée de détection
		const distancePlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x,  this.player.y);
		if (distancePlayer <= this.playerDetectionDistance) {
			// Met à jour la phase du boss en fonction de sa vie
			if (this.health > this.maxHealth / 2) {
				this.phase = 1;
			} else {
				this.phase = 2;
			}
			
			// Met à jour le mouvement du boss en fonction de sa phase
			if (this.phase === 1) {
				// Mouvement en spirale en phase 1
				const radius = 130;
				const speed = 0.1;
				const angleStep = 0.01;
				this.direction = new Phaser.Math.Vector2(1, 0);
				this.direction.rotate(angleStep * this.scene.time.now);
				this.direction.normalize();
				this.x = this.startX + this.direction.x * radius * speed;
				this.y = this.startY + this.direction.y * radius * speed;
			} else {
				// Mouvement vers le joueur en phase 2
				const direction = new Phaser.Math.Vector2( this.player.x - this.x,  this.player.y - this.y).normalize();
				this.body.setVelocity(direction.x * this.moveSpeedPhase2, direction.y * this.moveSpeedPhase2);
				// Arrête de tourner en rond
				this.rotation = 0;
			}
		} else {
			// Si le joueur est hors de portée de détection
			this.body.setVelocity(0);
			// Arrête de tourner en rond
			this.rotation = 0;
		}
		this.overlapBossPlayer();
	}
	
}      