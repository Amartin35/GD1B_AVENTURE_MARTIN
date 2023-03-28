import Player from "../entities/player.js";

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
    this.load.image('TileSet', 'src/assets/Assets_zelda.png');    
    this.load.tilemapTiledJSON('map', 'src/assets/spawn_map.json');
    this.load.spritesheet('perso', 'src/assets/PlayerSpriteSheet.png',{frameWidth: 34, frameHeight: 66});
    this.load.image("bullet", "src/assets/balle.png");  
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






    const attackAnimation;
    attackAnimation = this.physics.add.group();

    // affichage du sprite du personage

    this.player = new Player(this, 1420, 1340, 'perso');
    this.player.hp = this.hpData;
    this.player.hasArme = this.hasArmeData;
    this.player.hasDash = this.hasDashData;
    this.player.money = this.moneyData;
    this.player.hasDropBoss = this.dropBossData;
    this.physics.world.setBounds(0, 0, 1600, 1600);
    
    // ajout des collision  
    collisionLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, collisionLayer);
    propsLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, propsLayer);
    sortieLayer.setCollisionByExclusion(-1, true); 
    this.physics.add.collider(this.player, sortieLayer, () => {
      this.player.resetDash()
      this.scene.switch("Hub",{
        hp: this.player.hp,
        arme: this.player.hasArme,
        dash: this.player.hasDash,
        money: this.player.money,
        dropBoss: this.player.dropBoss
      });
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

