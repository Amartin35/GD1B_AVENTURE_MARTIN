export default class Menu extends Phaser.Scene{
  
    constructor() {
      super({key : "Menu"}); // mettre le meme nom que le nom de la classe
    }




    preload() {
        this.load.image('ecranTitre', 'src/assets/placeholder_menu.png');
    }


    create(){
        this.add.image(288, 512, "ecranTitre");

        this.add.text(100, 250, "Appuyer sur Space pour commencer"), {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: "40pt"
        }
        this.clavier = this.input.keyboard.createCursorKeys();
    }


    update(){
        //LANCE PREMIERE SCENE QUAND ESPACE APPUYE
        if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true){
            this.scene.start("Spawn_map",{
                hp: PLAYER_HP,
                hasArme: false,
                hasDash: false,
                money: 0,
                dropBoss: false
          

            });
          } 
    }
}