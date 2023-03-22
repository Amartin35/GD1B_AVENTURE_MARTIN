var player; // désigne le sprite du joueur
var groupe_plateformes; // contient toutes les plateformes
var clavier; // pour la gestion du clavier

// définition de la classe "selection"
export default class Spawn_map extends Phaser.Scene{ 
  
  constructor() {
    super({key : "Spawn_map"}); // mettre le meme nom que le nom de la classe
  }
  
  preload() {
    this.load.image('TileSet', 'src/assets/Assets_zelda.png');    
    this.load.tilemapTiledJSON('map', 'src/assets/spawn_map.json');
    this.load.spritesheet('perso','assets/perso.png',
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
    this.player = this.physics.add.sprite(10, 0, 'perso');
    

    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.zoom = 1;
    this.cameras.main.startFollow(this.player);

    // ancrage de la camera sur le joueur
    this.cameras.main.startFollow(this.player);  



  }
  
  update()  {



  
}
