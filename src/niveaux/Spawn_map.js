import Player from "../entities/player.js";

// définition de la classe "selection"
export default class Spawn_map extends Phaser.Scene{ 
  
  constructor() {
    super({key : "Spawn_map"}); // mettre le meme nom que le nom de la classe
  }
  
  preload() {
    this.load.image('TileSet', 'src/assets/Assets_zelda.png');    
    this.load.tilemapTiledJSON('map', 'src/assets/spawn_map.json');
    this.load.spritesheet('perso','src/assets/perso.png',
    { frameWidth: 31, frameHeight: 52 });
  }
  
  create()  {
    

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

    // affichage du sprite du personage
    this.player = new Player(this, 50, 50, 'perso');
    this.physics.world.setBounds(0, 0, 1600, 1600);
    

    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.zoom = 1;
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor(0xaaaaaa)

    // ancrage de la camera sur le joueur
    this.cameras.main.startFollow(this.player);  




  }
  
  update()  {
    this.player.update();
  }
}

