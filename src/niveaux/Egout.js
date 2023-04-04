import Clef from "../entities/clef.js";
import Zombie1  from "../entities/enemy.js";
import Player from "../entities/player.js";


export default class Egout extends Phaser.Scene{
  
    constructor() {
      super({key : "Egout"}); // mettre le meme nom que le nom de la classe

    }
  

 /////////////////////////////////////// PRELOAD ///////////////////////////////////////

    preload() {
      this.load.tilemapTiledJSON('mapEgout', 'src/assets/Egout.json');
      this.load.spritesheet('clef', 'src/assets/Sprite-clef.png',{frameWidth: 34, frameHeight: 34});
      this.load.image('invisibleDoor', 'src/assets/invisibleDoor.png');
      this.load.image('field_of_view','src/assets/field_of_view.png');
    }
  



 ////////////////////////////////////// CREATE ///////////////////////////////////////

    create() {
      const map = this.add.tilemap("mapEgout");
      const tileset = map.addTilesetImage("Assets_zelda", "TileSet");
      
      
      const no_collisionLayer = map.createLayer(
        "no_collision",
        tileset
      );
      const eauLayer = map.createLayer(
        "eau",
        tileset
      );
      const collisionLayer = map.createLayer(
        "collision",
        tileset
      );
      const sortie_HLayer = map.createLayer(
        "sortie_H",
        tileset
      );
      const porteLayer = map.createLayer(
        "porte",
        tileset
      );

      this.porteLayer = porteLayer





    // ajout des ennemis
    this.enemies = this.physics.add.group();

    let positions = [
      { x: 1504, y: 1280 },
      { x: 1216, y: 1472 },
      { x: 1056, y: 1152 },
      { x: 1024, y: 1248 },
      { x: 800, y: 1472 },
      { x: 672, y: 1216 },
      { x: 416, y: 1440 },
      { x: 192, y: 1408 },
      { x: 64, y: 1472 },
      { x: 128, y: 960 },
      { x: 320, y: 1024 },
      { x: 608, y: 928 },
      { x: 832, y: 640 },
      { x: 64, y: 480 },
      { x: 256, y: 480 },
    ];
    
    for (let i = 0; i < 15; i++) {
      let x = positions[i].x;
      let y = positions[i].y;
      let zombieType = Math.random() > 0.5 ? "rapide" : "normal";
      let zombie = new Zombie1(this, x, y, zombieType);
      this.enemies.add(zombie);
      zombie.body.setImmovable(true);
    }





    // affichage du sprite du personage
    this.player = new Player(this, 960, 128, 'perso');
    this.physics.world.setBounds(0, 0, 1600, 1600);





    // Crée le sprite pour l'image du champ de vision
    this.fieldOfView = this.add.sprite(this.player.x, this.player.y, 'field_of_view');
    this.fieldOfView.setOrigin(0.5);

 
 


    // création de l'objet porte invisible
    this.invisibleDoor = this.add.sprite(1056, 608, 'invisibleDoor').setAlpha(0);
    this.physics.add.existing(this.invisibleDoor);
    this.physics.add.collider(this.player, this.invisibleDoor, () => {
      if (window.myGameValues.hasClefValues === true) {
        console.log("Le joueur touche la porte invisible et a la clé");
        this.porteLayer.setVisible(false);
        this.invisibleDoor.destroy();
      } else {
        console.log("Le joueur touche la porte invisible mais n'a pas la clé");
      }
    });
    this.invisibleDoor.body.setAllowGravity(false);
    this.invisibleDoor.body.immovable = true;
    this.invisibleDoor.setSize(32,160);





    // ajout des collision  
    this.physics.add.overlap(this.player, this.enemies);
    collisionLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.enemies, collisionLayer);
    this.physics.add.collider(this.player, collisionLayer);
    this.physics.add.collider(this.enemies, eauLayer);
    this.physics.add.collider(this.player, eauLayer);
    eauLayer.setCollisionByExclusion(-1, true); 
    porteLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.enemies, porteLayer);
    sortie_HLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, sortie_HLayer, () => {
      this.player.resetDash()
      this.scene.switch("Hub",{
    });
    });





    this.clef = new Clef(this, 1312, 1184, 'clef');


     



    this.player.healthBar = this.add.sprite(50,20,'healtbar');
    this.player.healthBar.setScrollFactor(0);




    // ajout camera
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor(0xaaaaaa)
    this.cameras.main.startFollow(this.player);  



    }
    




 ////////////////////////////////////// UPDATE ///////////////////////////////////////
    update() {
      this.player.update();

      this.enemies.children.each((zombie) => {
          zombie.update();
      });
  
      this.physics.overlap(this.player, this.clef, () => {
        this.clef.collect()
      });

     
      // Met à jour la position du sprite pour suivre le joueur
      this.fieldOfView.setPosition(this.player.x, this.player.y);
  }
  
} 
  
