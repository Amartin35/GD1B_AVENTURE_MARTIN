import Player from "../entities/player.js";
import Monaie from "../entities/monaie.js";
// définition de la classe "selection"
export default class Hub extends Phaser.Scene{
  
  constructor() {
    super({key : "Hub"}); // mettre le meme nom que le nom de la classe
  }
  
  
   /////////////////////////////////////// PRELOAD ///////////////////////////////////////

  preload() {
    this.load.tilemapTiledJSON('mapHub', 'src/assets/Hub.json');
    this.load.image('invisibleDoor', 'src/assets/invisibleDoor.png');
    this.load.spritesheet('SpritetouchePNJ', 'src/assets/SpritetouchePNJ-sheet.png',{frameWidth: 34, frameHeight: 34});
    this.load.spritesheet('marchand', 'src/assets/SpritePnjmarchand.png',{frameWidth: 34, frameHeight: 64});
    this.load.spritesheet('marchandExclamation', 'src/assets/SpritePnjmarchandPointExclamation.png',{frameWidth: 34, frameHeight: 96});
  }
  



   /////////////////////////////////////// CREATE ///////////////////////////////////////

  create() {
   // creation de ma carte
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
        
      



    // affichage du sprite du personage
    this.player = new Player(this, 336, 1516, 'perso');
    this.physics.world.setBounds(0, 0, 1600, 1600);

    




    this.bleuView = this.add.sprite(this.player.x, this.player.y, 'bleuView');
    this.bleuView.setOrigin(0.5);

    




    // bloque l'acces au egouts is pas de dash
    this.invisibleDoor = this.add.sprite(1024, 864, 'invisibleDoor').setAlpha(0);
    this.physics.add.existing(this.invisibleDoor);
    this.physics.add.collider(this.player, this.invisibleDoor, () => {
      if (window.myGameValues.hasDashValues === true) {
        console.log("Le joueur touche la porte invisible et a le dash");
        this.invisibleDoor.destroy();
      } else {
        console.log("Le joueur touche la porte invisible mais n'a pas le dash");
      }
    });
    this.invisibleDoor.body.setAllowGravity(false);
    this.invisibleDoor.body.immovable = true;
    this.invisibleDoor.setSize(32,160);
    




    // ajout des collision  
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
    




    // ajout des collectibles
    this.monaies = [
      new Monaie(this, 944, 720, 'monaie'),
      new Monaie(this, 944, 1552, 'monaie'),
      new Monaie(this, 112, 1552, 'monaie'),
    ];





    // ajout de l'ui barre de vie 
    this.player.healthBar = this.add.sprite(50,20,'healtbar');
    this.player.healthBar.setScrollFactor(0);
    this.player.healthBar.setDepth(1);




    // ajout camera
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

    
// Ajout du marchand
if (window.myGameValues.hasArmeValues === true) {
  // Si le joueur a déjà acheté une arme
  this.marchand = this.physics.add.sprite(75, 800, 'marchand');
  this.marchand.anims.play('Idlemarchand');
} else {
  // Si le joueur n'a pas encore acheté d'arme
  this.toucheA = this.physics.add.sprite(100, 800, 'SpritetouchePNJ');
  this.toucheA.anims.play('toucheA');
  this.marchand = this.physics.add.sprite(75, 800, 'marchandExclamation');
  this.marchand.anims.play('IdlemarchandExclamation');

}

// Ajouter une collision entre le joueur et le marchand
this.physics.add.collider(this.player, this.marchand);
this.marchand.body.setImmovable(true);
this.player.setDepth(1);
this.marchand.setDepth(0);





// Ajouter un écouteur d'événements de clavier
this.input.keyboard.on('keydown', function(event) {
  const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.marchand.x, this.marchand.y);
  if ((event.key === "a"||this.pad?.A) && distance < MARCHAND_TRIGGER) {
    // Appeler la fonction pour acheter l'arme
    this.buyWeapon();
  }
}, this);
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
}
buyWeapon() {
  // Vérifie que le joueur a suffisamment de monnaie pour acheter l'arme
  const weaponPrice = 4; // prix de l'arme
  if (window.myGameValues.moneyValues >= weaponPrice) {
    // Déduit le prix de l'arme de la monnaie du joueur
    window.myGameValues.moneyValues -= weaponPrice;
    // Ajouter l'arme au joueur
    window.myGameValues.hasArmeValues = true;
    console.log("Arme achetée !");
    
    // Changer l'animation du marchand
    this.marchand.anims.stop();
    this.marchand.setTexture('marchand');
    this.marchand.anims.play('Idlemarchand');
    
  } else {
    console.log("Vous n'avez pas assez de monnaie pour acheter l'arme.");
  }
}

}

    