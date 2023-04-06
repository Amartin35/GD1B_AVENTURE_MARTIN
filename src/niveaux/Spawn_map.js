import Player from "../entities/player.js";
import Zombie1 from "../entities/enemy.js";
import Monaie from "../collectible/monaie.js";
import DashPowerUp from "../collectible/dashPowerUp.js";
import RecupVie from "../collectible/recupVie.js";

export default class Spawn_map extends Phaser.Scene{ 
  
  constructor() {
    super({key : "Spawn_map"});
  }
  
  

 
 
 /////////////////////////////////////// PRELOAD ///////////////////////////////////////

  preload() {
    this.load.image('TileSet', 'src/assets/Assets_zelda.png');   
    this.load.image("bullet", "src/assets/SpriteAttack.png");   
    this.load.image("bleuView", "src/assets/bleuView.png");   
    this.load.image("HudDash", "src/assets/HudDash.png"); 
    this.load.image("HudClef", "src/assets/HudClef.png"); 
    this.load.image("barreMetalHud", "src/assets/SpriteBarreMetal.png"); 
    this.load.tilemapTiledJSON('map', 'src/assets/spawn_map.json');
    this.load.spritesheet('perso', 'src/assets/PlayerSpriteSheet.png',{frameWidth: 34, frameHeight: 66});
    this.load.spritesheet('zombie1', 'src/assets/zombie_characters1.png',{frameWidth: 34, frameHeight: 68});
    this.load.spritesheet('zombie2', 'src/assets/zombie_characters2.png',{frameWidth: 34, frameHeight: 68});
    this.load.spritesheet('monaie', 'src/assets/Sprite-monaie.png',{frameWidth: 34, frameHeight: 34});
    this.load.spritesheet('dashPowerUp', 'src/assets/Sprite-dashpowerup.png',{frameWidth: 34, frameHeight: 34});
    this.load.spritesheet('recupVie', 'src/assets/Spriteviecoeur.png',{frameWidth: 34, frameHeight: 34});
    this.load.spritesheet("healtbar", "src/assets/UIHP5.png", {frameWidth: 98, frameHeight: 33}); 
    this.load.spritesheet("HudMonaie", "src/assets/SpriteMonaieHud.png", {frameWidth: 66, frameHeight: 34}); 
   
  }
  




  /////////////////////////////////////// CREATE ///////////////////////////////////////

  create()  {
   // creation de ma carte
    const map = this.add.tilemap("map");
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
    const sortieLayer = map.createLayer(
      "sortie",
      tileset
    );
    this.dashLayer = map.createLayer(
      "dash",
      tileset
    );





    // ajout des ennemis
    this.enemies = this.physics.add.group();

    let positions = [
      { x: 960, y: 1472 },
      { x: 1024, y: 1472 },
      { x: 960, y: 1536 },
      { x: 1056, y: 1536 },
      { x: 1216, y: 1568 },
      { x: 1536, y: 1536 },
      { x: 1536, y: 1312 },
      { x: 1376, y: 768 },
      { x: 960, y: 1152 },
      { x: 416, y: 1024 },
      { x: 896, y: 672 },
      { x: 224, y: 128 },
    ];
    
    for (let i = 0; i < 12; i++) {
      let x = positions[i].x;
      let y = positions[i].y;
      
      let zombie = new Zombie1(this, x, y, "normal");
      this.enemies.add(zombie);
      zombie.body.setImmovable(true);
    
    }





    // affichage du sprite du personage
    this.player = new Player(this, 1420, 1340, 'perso');
    this.physics.world.setBounds(0, 0, 1600, 1600);


    




    this.bleuView = this.add.sprite(this.player.x, this.player.y, 'bleuView');
    this.bleuView.setOrigin(0.5);




    // ajout des collision  
    this.dashLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, this.dashLayer, () => { 
      console.log("collision layer dash"); 
    }, () => {
      return !this.player.isDashing;
    });
    this.physics.add.overlap(this.player, this.enemies);
    collisionLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, collisionLayer);
    this.physics.add.collider(this.enemies, collisionLayer);
    propsLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, propsLayer);
    this.physics.add.collider(this.enemies, propsLayer);
    sortieLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, sortieLayer, () => {
      this.player.resetDash()
      this.scene.switch("Hub", {        
      });
    });

 



    // ajout des collectibles
    this.monaies = [
      new Monaie(this, 368, 1408, 'monaie'),
      new Monaie(this, 1552, 624, 'monaie'),
      new Monaie(this, 752, 832, 'monaie'),
      new Monaie(this, 1550, 1424, 'monaie'),
      new Monaie(this, 32, 384, 'monaie'),
    ];




    // ajout de l'ui et import du dash power up
    this.dashPowerUp = new DashPowerUp(this, 1056, 1440, 'dashPowerUp');
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

  



    // ajout de la caméra
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor(0xaaaaaa);
    this.cameras.main.setLerp(0.5);
  }
  



 /////////////////////////////////////// UPDATE  ///////////////////////////////////////

  update()  {
    this.player.update();
    this.enemies.children.each((zombie) => {
      zombie.update();
    });
     // détection de collisions entre le joueur et les monaies
     for (let i = 0; i < this.monaies.length; i++) {
      const monaie = this.monaies[i];
      if (this.physics.overlap(this.player, monaie)) {
          monaie.collectmonaie();
      }
    }
    this.physics.overlap(this.player, this.dashPowerUp, () => {
      this.dashPowerUp.collectDashPowerUp();
    });
    // Met à jour la position du sprite pour suivre le joueur
    this.bleuView.setPosition(this.player.x, this.player.y);

    if(window.myGameValues.hasArmeValues){
      this.barreMetalHud.visible = true;
    }

    if(window.myGameValues.hasDashValues == true){
      this.HudDash.visible = true;
    }
    if(window.myGameValues.hasClefValues == true){
      this.HudClef.visible = true;
    }

  }
  
}

