
// définition de la classe "selection"
export default class Hub extends Phaser.Scene{
  
  constructor() {
    super({key : "Hub"}); // mettre le meme nom que le nom de la classe
  }
  
  preload() {

  }

  create() {
    this.add.image(400, 300, "img_ciel");
    this.porte2 = this.physics.add.staticSprite(50, 550, "img_porte2");
    this.porte3 = this.physics.add.staticSprite(750, 550, "img_porte3");
    this.groupe_plateformes = this.physics.add.staticGroup();
    this.groupe_plateformes.create(200, 584, "img_plateforme"); 
    this.groupe_plateformes.create(600, 584, "img_plateforme");
    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Vous êtes dans le Hub", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });

    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes);
  }
  
  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (this.clavier.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    if (this.physics.overlap(this.player, this.porte2)) this.scene.start("QuartierChinois");
    if (this.physics.overlap(this.player, this.porte3)) this.scene.start("Egout");
    
  }
}
