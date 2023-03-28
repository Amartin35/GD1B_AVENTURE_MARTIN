import Player from "../entities/player.js";

// définition de la classe "selection"
export default class Egout extends Phaser.Scene{
  
    constructor() {
      super({key : "Egout"}); // mettre le meme nom que le nom de la classe
    }
    
    init(data){ 
      this.hpData = data.hp; 
    this.hasArmeData = data.arme;
    this.hasDashData = data.dash;
    this.moneyData = data.money;
    this.dropBossData = data.dropBoss;
    console.log(data.dash);
    console.log(data.dropBoss);
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

      // affichage du sprite du personage
    this.player = new Player(this, 960, 128, 'perso');
    this.player.hp = this.hpData;
    this.player.hasArme = this.hasArmeData;
    this.player.hasDash = this.hasDashData;
    this.player.money = this.moneyData;
    this.player.hasDropBoss = this.dropBossData;
    this.physics.world.setBounds(0, 0, 1600, 1600);


     // ajout des collision  
     collisionLayer.setCollisionByExclusion(-1, true); 
     this.physics.add.collider(this.player, collisionLayer);
     porteLayer.setCollisionByExclusion(-1, true); 
     this.physics.add.collider(this.player, porteLayer);
     sortie_HLayer.setCollisionByExclusion(-1, true); 
     this.physics.add.collider(this.player, sortie_HLayer, () => {
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
    
    update() {
      this.player.update();
    
    }
}
  