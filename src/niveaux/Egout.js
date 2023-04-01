import Zombie1  from "../entities/enemy.js";
import Player from "../entities/player.js";

// définition de la classe "selection"
export default class Egout extends Phaser.Scene{
  
    constructor() {
      super({key : "Egout"}); // mettre le meme nom que le nom de la classe
    }
    


    preload() {
      this.load.tilemapTiledJSON('mapEgout', 'src/assets/Egout.json');
    }
  
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

    // Ajout des ennemis
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
      
      let zombie = new Zombie1(this, x, y);
      this.enemies.add(zombie);
      zombie.body.setImmovable(true);
    
    }







      // affichage du sprite du personage
    this.player = new Player(this, 960, 128, 'perso');
    console.log(this.player.hp, "hp");
    console.log(this.player.hasArmeData ? "a  arme" :"n'a pas l'arme");
    console.log(this.player.hasDashData ? "a  dash" :"n'a pas le dash");
    console.log(this.player.moneyData, "money");
    console.log(this.player.dropBossData ? "a  le drop du boss" :"n'a pas le drop du boss");
    this.physics.world.setBounds(0, 0, 1600, 1600);


    // ajout des collision  
    this.physics.add.overlap(this.player, this.enemies);
    collisionLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.enemies, collisionLayer);
    this.physics.add.collider(this.player, collisionLayer);
    this.physics.add.collider(this.enemies, eauLayer);
    eauLayer.setCollisionByExclusion(-1, true); 
    porteLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, porteLayer);
    sortie_HLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, sortie_HLayer, () => {
      this.player.resetDash()
      this.scene.switch("Hub",{
    });
    });

     
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
      this.enemies.children.each((zombie) => {
        zombie.update();
      });
    
    }
}
  