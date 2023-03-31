import Player from "../entities/player.js";
import { Zombie1 } from "../entities/enemy.js";


// définition de la classe "selection"
export default class Spawn_map extends Phaser.Scene{ 
  
  constructor() {
    super({key : "Spawn_map"}); // mettre le meme nom que le nom de la classe
  }
  
  init(data){ 
    
    this.hpData = data.hp; 
    this.hasArmeData = data.arme;
    this.hasDashData = data.dash;
    this.moneyData = data.money;
    this.dropBossData = data.dropBoss;

    console.log(data.hp, "hp");
    console.log(data.arme ? "a  arme" :"n'a pas l'arme");
    console.log(data.dash ? "a  dash" :"n'a pas le dash");
    console.log(data.money, "money");
    console.log(data.dropBoss ? "a  le drop du boss" :"n'a pas le drop du boss");
  }

 


  preload() {
    this.load.spritesheet("UIHP5", "src/assets/UIHP5.png", {frameWidth: 100, frameHeight: 40}); 
    this.load.image('TileSet', 'src/assets/Assets_zelda.png');    
    this.load.tilemapTiledJSON('map', 'src/assets/spawn_map.json');
    this.load.spritesheet('perso', 'src/assets/PlayerSpriteSheet.png',{frameWidth: 34, frameHeight: 66});
    this.load.image("bullet", "src/assets/SpriteAttack.png");  
    this.load.spritesheet('zombie1', 'src/assets/zombie_characters1.png',{frameWidth: 34, frameHeight: 66});
    this.load.spritesheet('zombie2', 'src/assets/zombie_characters2.png',{frameWidth: 34, frameHeight: 66});
    
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


    // Ajout des ennemis
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
      
      let zombie = new Zombie1(this, x, y);
      this.enemies.add(zombie);
      zombie.body.setImmovable(true);
    
    }

  

    // affichage du sprite du personage

    this.player = new Player(this, 1420, 1340, 'perso');
    this.player.hp = this.hpData;
    this.player.hasArme = this.hasArmeData;
    this.player.hasDash = this.hasDashData;
    this.player.money = this.moneyData;
    this.player.hasDropBoss = this.dropBossData;
    this.physics.world.setBounds(0, 0, 1600, 1600);
    
    // ajout des collision  
    
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
      this.scene.switch("Hub",{
        hp: this.player.hp,
        arme: this.player.hasArme,
        dash: this.player.hasDash,
        money: this.player.money,
        dropBoss: this.player.hasDropBoss
      });
    });






  

    // Ajout de la caméra
    this.cameras.main.setBounds(0, 0, 1600, 1600);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor(0xaaaaaa);






  }
  
  update()  {
    this.player.update();
    this.enemies.children.each((zombie) => {

      zombie.update();

    });



  }
}

