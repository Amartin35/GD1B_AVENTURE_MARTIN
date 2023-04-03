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

    
    this.player.healthBar = this.add.sprite(50,20,'healtbar');
    this.player.healthBar.setScrollFactor(0);
    // ajout camera
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor(0xaaaaaa)
    // ancrage de la camera sur le joueur
    this.cameras.main.startFollow(this.player);  
    
    
    
  }
      
      update() {
        this.player.update();
       
        // Détection de collisions entre le joueur et les monaies
        for (let i = 0; i < this.monaies.length; i++) {
          const monaie = this.monaies[i];
          if (this.physics.overlap(this.player, monaie)) {
              monaie.collectmonaie();
          }
        }

      }
    }
    