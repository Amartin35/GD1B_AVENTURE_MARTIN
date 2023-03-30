export default class UI extends Phaser.Scene {
    constructor() {
        super({ key: 'UI' });
    }

    preload() {
        this.load.spritesheet('UIHP5', 'assets/UI/UI_HP_5.png', { frameWidth: 28, frameHeight: 14 });
    }

    create() {
        let hp = this.physics.add.sprite(50, 15, 'UIHP5').setScrollFactor(0);

        this.anims.create({
            key: 'hp1',
            frames: [{ key: 'UIHP5', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'hp2',
            frames: [{ key: 'UIHP5', frame: 1 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'hp3',
            frames: [{ key: 'UIHP5', frame: 2 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'hp4',
            frames: [{ key: 'UIHP5', frame: 3 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'hp5',
            frames: [{ key: 'UIHP5', frame: 4 }],
            frameRate: 20
        });

        // Fonction pour jouer l'animation en fonction de la valeur de hp
        const playHPAnimation = (hpValue) => {
            switch (hpValue) {
                case 1:
                    hp.play('hp1');
                    break;
                case 2:
                    hp.play('hp2');
                    break;
                case 3:
                    hp.play('hp3');
                    break;
                case 4:
                    hp.play('hp4');
                    break;
                case 5:
                default:
                    hp.play('hp5');
                    break;
            }
        };

        // Utilisez la fonction pour jouer l'animation initiale
        playHPAnimation(this.hpData);

        // ...
    }

    init(data){ 
        this.hpData = data.hp; 
        console.log(this.hpData, "hp");
      }
}
