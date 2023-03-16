var player; // désigne le sprite du joueur
var groupe_plateformes; // contient toutes les plateformes
var clavier; // pour la gestion du clavier

// définition de la classe "selection"
export default class QuartierChinois extends Phaser.Scene{ 
  
  constructor() {
    super({key : "QuartierChinois"}); // mettre le meme nom que le nom de la classe
  }
  
  preload() {
  }
  
  create()  {
    



  }
  
  update()  {
    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-300);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(300);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-300);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(300);
    }
  }

  
}
