export default class Menu extends Phaser.Scene{
    constructor() {
      super({key : "Menu"}); // mettre le meme nom que le nom de la classe
    }




/////////////////////////////////////// PRELOAD ///////////////////////////////////////
    preload() {
        this.load.image('ecranTitre', 'src/assets/EcranTitre.png');
        this.load.audio('musique', 'src/assets/WelcomeToTheJungle.mp3');
    }

/////////////////////////////////////// CREATE ///////////////////////////////////////
    create(){
        this.add.image(256, 144, "ecranTitre");
        // Ajoutez la piste audio à la scène
        let musique = this.sound.add('musique', { loop: true });
        musique.play();
        musique.setVolume(0.1); // Réduire le volume à 50%
        console.log('Music started');
        
        this.clavier = this.input.keyboard.createCursorKeys();
    }

 /////////////////////////////////////// UPDATE  ///////////////////////////////////////
    update(){
        //LANCE PREMIERE SCENE QUAND ESPACE APPUYE
        if (Phaser.Input.Keyboard.JustDown(this.clavier.space)){
            this.scene.start("Spawn_map",{
            });
        } 
        
    }
}