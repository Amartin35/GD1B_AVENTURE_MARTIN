import Player from "../entities/player.js";

// définition de la classe "selection"
export default class Spawn_map extends Phaser.Scene{ 
  
  constructor() {
    super({key : "Spawn_map"}); // mettre le meme nom que le nom de la classe
  }
  


 


  preload() {
    this.load.image('TileSet', 'src/assets/Assets_zelda.png');    
    this.load.tilemapTiledJSON('map', 'src/assets/spawn_map.json');
    this.load.spritesheet('perso', 'src/assets/PlayerSpriteSheet.png',{frameWidth: 34, frameHeight: 66});
  }
  
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
    const dashLayer = map.createLayer(
      "dash",
      tileset
    );







    // affichage du sprite du personage       1420, 1340 coordonné du vrais spawn

    this.player = new Player(this, 100, 100, 'perso');
    this.physics.world.setBounds(0, 0, 1600, 1600);
    
    // ajout des collision  
    collisionLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, collisionLayer);
    propsLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, propsLayer);
    sortieLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, sortieLayer, () => {
      this.player.resetDash()
      this.scene.switch("Hub");
    });
  
    // ajout camera
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor(0xaaaaaa)
    // ancrage de la camera sur le joueur
    this.cameras.main.startFollow(this.player);  




  }
  
  update()  {
    this.player.update();
  }
}

