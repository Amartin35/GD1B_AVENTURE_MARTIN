import Player from "../entities/player.js";
import Monaie from "../collectible/monaie.js";
export default class Hub extends Phaser.Scene{
	constructor() {
		super({key : "Hub"}); // mettre le meme nom que le nom de la classe
		this.messageBloque = false;
	}
	
	/////////////////////////////////////// PRELOAD ///////////////////////////////////////
	preload() {
		this.load.tilemapTiledJSON('mapHub', 'src/assets/Hub.json');
		this.load.image('invisibleDoor', 'src/assets/invisibleDoor.png');
		this.load.image('imgTexteTrue', 'src/assets/image_texte_true.png');
		this.load.image('imgTexteFalse', 'src/assets/image_texte_false.png');
		this.load.image('imgTexteBegin', 'src/assets/image_texte_begin.png');
		this.load.image('imgTextePnj1', 'src/assets/image_texte_pnj1.png');
		this.load.image('imgTextePnjFalse', 'src/assets/image_texte_pnj2False.png');
		this.load.image('imgTextePnjTrue', 'src/assets/image_texte_pnj2True.png');
		this.load.image('imgTextePnj2DropBoss', 'src/assets/image_texte_pnj2DropBoss.png');
		this.load.spritesheet('SpritetouchePNJ', 'src/assets/SpritetouchePNJ-sheet.png',{frameWidth: 34, frameHeight: 34});
		this.load.spritesheet('marchand', 'src/assets/SpritePnjmarchand.png',{frameWidth: 34, frameHeight: 64});
		this.load.spritesheet('marchandExclamation', 'src/assets/SpritePnjmarchandPointExclamation.png',{frameWidth: 34, frameHeight: 96});
		this.load.spritesheet('PnjQuete', 'src/assets/pnjQuetes.png',{frameWidth: 34, frameHeight: 64});
	}
	
	/////////////////////////////////////// CREATE ///////////////////////////////////////
	
	create() {
		const map = this.add.tilemap("mapHub");
		const tileset = map.addTilesetImage("Assets_zelda", "TileSet");
		
		const no_collisionLayer = map.createLayer(
			"no_collision",
			tileset
		);
		const collisionLayer = map.createLayer(
			"collision",
			tileset
		);
		const propsLayer = map.createLayer(
			"props",
			tileset
		);
		const sortie_ELayer = map.createLayer(
			"sortie_E",
			tileset
		);
		const sortie_QLayer = map.createLayer(
			"sortie_Q",
			tileset
		);
							



		// Affichage du sprite du personage
		this.player = new Player(this, 336, 1516, 'perso');
		this.physics.world.setBounds(0, 0, 1600, 1600);

		// Filtre bleu
		this.bleuView = this.add.sprite(this.player.x, this.player.y, 'bleuView');
		this.bleuView.setOrigin(0.5);
		
		
		
		
		// Bloque l'acces au egouts is pas de dash
		this.invisibleDoor = this.add.sprite(1024, 864, 'invisibleDoor').setAlpha(0);
		this.physics.add.existing(this.invisibleDoor);
		this.physics.add.collider(this.player, this.invisibleDoor);
		this.invisibleDoor.body.setAllowGravity(false);
		this.invisibleDoor.body.immovable = true;
		this.invisibleDoor.setSize(32,160);
		
		
		

		// Ajout des collision  
		collisionLayer.setCollisionByExclusion(-1, true); 
		this.physics.add.collider(this.player, collisionLayer);
		propsLayer.setCollisionByExclusion(-1, true); 
		this.physics.add.collider(this.player, propsLayer);
		sortie_ELayer.setCollisionByExclusion(-1, true); 
		this.physics.add.collider(this.player, sortie_ELayer, () => {
			this.player.resetDash()
			this.scene.switch("Egout",{
			});
		});
		sortie_QLayer.setCollisionByExclusion(-1, true); 
		this.physics.add.collider(this.player, sortie_QLayer, () => {
			this.player.resetDash()
			this.scene.switch("Spawn_map",{
			});
		});
		
		
		
		
		
		// Ajout des collectibles
		this.monaies = [
			new Monaie(this, 944, 720, 'monaie'),
			new Monaie(this, 944, 1552, 'monaie'),
			new Monaie(this, 112, 1552, 'monaie'),
		];
		
		
		
		
		// Ajout de l'ui 
		this.player.healthBar = this.add.sprite(50,20,'healtbar');
		this.player.healthBar.setScrollFactor(0);
		this.player.HudMonaie = this.add.sprite(473, 20, "HudMonaie");
		this.player.HudMonaie.setScrollFactor(0);
		this.barreMetalHud = this.add.image(490, 45, "barreMetalHud");
		this.barreMetalHud.setScrollFactor(0);
		this.barreMetalHud.visible = false;
		this.HudDash = this.add.image(495, 75, "HudDash");
		this.HudDash.setScrollFactor(0);
		this.HudDash.visible = false;
		this.HudClef = this.add.image(487, 116, "HudClef");
		this.HudClef.setScrollFactor(0);
		this.HudClef.visible = false;
		this.HudDropBoss = this.add.image(490, 150, "DropBoss");
		this.HudDropBoss.setScrollFactor(0);
		this.HudDropBoss.visible = false;
		
		
		

		// Ajout camera
		this.cameras.main.setBounds(0, 0, 1600, 1600);
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBackgroundColor(0xaaaaaa)
		this.cameras.main.startFollow(this.player);  
		




		// Pour le marchand avec point d'exclamation
		this.anims.create({
			key: 'IdlemarchandExclamation',
			frames: this.anims.generateFrameNumbers('marchandExclamation', { start: 0, end: 1 }),
			frameRate: 4,
			repeat: -1
		});
		this.anims.create({
			key: 'toucheA',
			frames: this.anims.generateFrameNumbers('SpritetouchePNJ', { start: 0, end: 1 }),
			frameRate: 4,
			repeat: -1
		});
		
		// Pour le marchand sans point d'exclamation
		this.anims.create({
			key: 'Idlemarchand',
			frames: this.anims.generateFrameNumbers('marchand', { start: 0, end: 1 }),
			frameRate: 4,
			repeat: -1
		});

		// Pour le Pnj de la quete
		this.anims.create({
			key: 'IdlePnjQuete',
			frames: this.anims.generateFrameNumbers('PnjQuete', { start: 0, end: 1 }),
			frameRate: 4,
			repeat: -1
		});
		
		
		
		
		// Ajout du marchand
		if (window.myGameValues.hasArmeValues) {
			// Si le joueur a déjà acheté une arme
			this.marchand = this.physics.add.sprite(75, 800, 'marchand');
			this.marchand.anims.play('Idlemarchand');
			this.toucheA1.visible = false
		} 
		else {
			// Si le joueur n'a pas encore acheté d'arme
			this.toucheA1 = this.physics.add.sprite(100, 800, 'SpritetouchePNJ');
			this.toucheA1.anims.play('toucheA');
			this.marchand = this.physics.add.sprite(75, 800, 'marchandExclamation');
			this.marchand.anims.play('IdlemarchandExclamation');
		}
		
		// Ajoute une collision entre le joueur et le marchand
		this.physics.add.collider(this.player, this.marchand);
		this.marchand.body.setImmovable(true);
		this.player.setDepth(1);
		this.marchand.setDepth(0);
		
		
		
		
		
		let canBuyWeapon = true;
		// Ajoute un écouteur d'événements de clavier
		this.input.keyboard.on('keydown', function(event) {
			const distanceMarchand = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.marchand.x, this.marchand.y);
			
			if ((event.key === "a" || this.pad?.A) && distanceMarchand < MARCHAND_TRIGGER && canBuyWeapon) {
				canBuyWeapon = false;
				
				// Affiche l'image "begin"
				this.imageBegin = this.add.image(256, 233, 'imgTexteBegin');
				this.imageBegin.setOrigin(0.5);
				this.imageBegin.setScrollFactor(0);
				

				this.time.delayedCall(1500, () => {
					this.imageBegin.destroy();
					this.buyWeapon();
				}, [], this);
				
				// Réinitialise la variable canBuyWeapon après 5 secondes si le joueur n'a pas encore acheté l'arme
				setTimeout(() => {
					if (window.myGameValues.hasArmeValues === false) {
						canBuyWeapon = true;
					}
				}, 5000);
			}
		}, this);
		
		
		// Ajout du PNJ pour Quete
		this.pnjQuete = this.physics.add.sprite(944, 848, 'PnjQuete');
		this.toucheA = this.physics.add.sprite(965, 820, 'SpritetouchePNJ');
		this.toucheA.anims.play('toucheA');
		this.pnjQuete.anims.play('IdlePnjQuete');
		this.pnjQuete.setImmovable(true);
		this.pnjQuete.setDepth(0);
		
		this.input.keyboard.on('keydown', (event) => {
			const distancePnj = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.pnjQuete.x, this.pnjQuete.y);
			
			if ((event.key === "a" || this.pad?.A) && distancePnj < PNJ_TRIGGER && !this.messageBloque && !window.myGameValues.hasdropBossValues) {
				
				this.messageBloque = true; // définie la variable comme true pour éviter que les messages se superposent
				

				this.imgTextePnj1 = this.add.image(256, 233, 'imgTextePnj1');
				this.imgTextePnj1.setOrigin(0.5);
				this.imgTextePnj1.setScrollFactor(0);
				
				
				this.time.delayedCall(7000, () => {
					this.imgTextePnj1.destroy();
				}, [], this);
				
				// Affiche le deuxième message
				this.time.delayedCall(7000, () => {
					if(window.myGameValues.hasDashValues == true){
						this.imgTextePnjTrue = this.add.image(256, 233, 'imgTextePnjTrue');
						this.imgTextePnjTrue.setOrigin(0.5);
						this.imgTextePnjTrue.setScrollFactor(0);
						this.invisibleDoor.destroy();
					}
					else{
						this.imgTextePnjFalse = this.add.image(256, 233, 'imgTextePnjFalse');
						this.imgTextePnjFalse.setOrigin(0.5);
						this.imgTextePnjFalse.setScrollFactor(0);
					}
					
					// Détruit le deuxième message
					this.time.delayedCall(2000, () => {
						if(window.myGameValues.hasDashValues == true){
							this.imgTextePnjTrue.destroy();
						}
						else{
							this.imgTextePnjFalse.destroy();
						}
					}, [], this);
					setTimeout(() => {
						this.messageBloque = false;
					}, 1000);
				}, [], this);
				
			}
			else if((event.key === "a" || this.pad?.A) && distancePnj < PNJ_TRIGGER && !this.messageBloque && window.myGameValues.hasdropBossValues){
				this.messageBloque = true;
				this.imgTextePnj1DropBoss = this.add.image(256, 233, 'imgTextePnj2DropBoss');
				this.imgTextePnj1DropBoss.setOrigin(0.5);
				this.imgTextePnj1DropBoss.setScrollFactor(0);
				this.time.delayedCall(2000, () => {
					this.imgTextePnj1DropBoss.destroy();
					this.time.delayedCall(1500, () => {
						this.add.text(45, 75, "Merci d'avoir joué !", { font: "54px Arial", fill: "#FFFFFF" }).setScrollFactor(0);
						this.cameras.main.fadeOut(FONDU_CAM);
						this.time.delayedCall(3333, () => {
							location.reload();
						});
					});
				});
			}
		});
	}
	
	/////////////////////////////////////// UPDATE  ///////////////////////////////////////
	
	update() {
		this.player.update();

		// détection de collisions entre le joueur et les monaies
		for (let i = 0; i < this.monaies.length; i++) {
			const monaie = this.monaies[i];
			if (this.physics.overlap(this.player, monaie)) {
				monaie.collectmonaie();
			}
		}

		// Met à jour la position du sprite pour suivre le joueur
		this.bleuView.setPosition(this.player.x, this.player.y);

		// UI en visible
		if(window.myGameValues.hasArmeValues){
			this.barreMetalHud.visible = true;
			this.toucheA1.visible = false
		}
		if(window.myGameValues.hasDashValues == true){
			this.HudDash.visible = true;
		}
		if(window.myGameValues.hasClefValues == true){
			this.HudClef.visible = true;
		}
		if(window.myGameValues.hasdropBossValues == true){
			this.HudDropBoss.visible = true;
		}
	}




	buyWeapon() {
		// Vérifie que le joueur a suffisamment de monnaie pour acheter l'arme
		const weaponPrice = 4; // prix de l'arme

		if (window.myGameValues.moneyValues >= weaponPrice) {
			// Déduit le prix de l'arme de la monnaie du joueur
			window.myGameValues.moneyValues -= weaponPrice;
			// Ajouter l'arme au joueur
			window.myGameValues.hasArmeValues = true;

			const imageTrue = this.add.image(256, 233, 'imgTexteTrue');
			imageTrue.setOrigin(0.5);
			imageTrue.setScrollFactor(0);

			// Change l'animation du marchand
			this.marchand.anims.stop();
			this.marchand.setTexture('marchand');
			this.marchand.anims.play('Idlemarchand');
			
			// Destruction de l'image
			this.time.delayedCall(2500, () => {
				imageTrue.destroy();
			}, [], this);
			
		} else {
			console.log("Vous n'avez pas assez de monnaie pour acheter l'arme.");
			const imageFalse = this.add.image(256, 233, 'imgTexteFalse');
			imageFalse.setOrigin(0.5);
			imageFalse.setScrollFactor(0);
			
			// Destruction de l'image
			this.time.delayedCall(2500, () => {
				imageFalse.destroy();
			}, [], this);
		}
	}
}





