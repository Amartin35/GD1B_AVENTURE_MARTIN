import Player from "../entities/player.js";

// définition de la classe "selection"
export default class Hub extends Phaser.Scene{
  
  constructor() {
    super({key : "Hub"}); // mettre le meme nom que le nom de la classe
  }
  
  preload() {
    this.load.tilemapTiledJSON('mapHub', 'src/assets/Hub.json');
  }

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

    // affichage du sprite du personage
    this.player = new Player(this, 336, 1516, 'perso');
    this.physics.world.setBounds(0, 0, 1600, 1600);


     // ajout des collision  
     collisionLayer.setCollisionByExclusion(-1, true); 
     this.physics.add.collider(this.player, collisionLayer);
     propsLayer.setCollisionByExclusion(-1, true); 
     this.physics.add.collider(this.player, propsLayer);
     sortie_ELayer.setCollisionByExclusion(-1, true); 
     this.physics.add.collider(this.player, sortie_ELayer, () => {
       this.scene.switch("Egout");
     });
     sortie_QLayer.setCollisionByExclusion(-1, true); 
     this.physics.add.collider(this.player, sortie_QLayer, () => {
       this.scene.switch("Spawn_map");
     });

    // ajout camera
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor(0xaaaaaa)
    // ancrage de la camera sur le joueur
    this.cameras.main.startFollow(this.player);  
  

   
  }
  
  update() {
    this.player.update();

  }
}
