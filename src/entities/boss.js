import RecupVie from "../collectible/recupVie.js";
import Player from "./player.js";
export default class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, player) {
      super(scene, x, y, texture);
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.world.enable(this);
      this.body.setCollideWorldBounds(true);
      this.body.setSize(98, 98);
  
      this.player = player;
      this.phase = 1;
      this.maxHealth = 80;
      this.health = this.maxHealth;
      this.moveSpeedPhase1 = 40;
      this.moveSpeedPhase2 = 100;
      this.playerDetectionDistance = 300;
        // Définir la position de départ du boss
        this.startX = x;
        this.startY = y;
    }

    takeDamage() {
        this.health -= 10; // Réduire la santé du boss de 10 points
        if (this.health <= 0) {
            this.destroy();
        }
    }

    update() {
        // Vérifie si le joueur est à portée de détection
        const distancePlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x,  this.player.y);
        if (distancePlayer <= this.playerDetectionDistance) {
          // Met à jour la phase du boss en fonction de sa vie
          if (this.health > this.maxHealth / 2) {
            this.phase = 1;
          } else {
            this.phase = 2;
          }
      
          // Mettre à jour le mouvement du boss en fonction de sa phase
          if (this.phase === 1) {
            // Mouvement en spirale en phase 1
            const radius = 80;
            const speed = 0.1;
            const angleStep = 0.01;
            this.direction = new Phaser.Math.Vector2(1, 0);
            this.direction.rotate(angleStep * this.scene.time.now);
            this.direction.normalize();
            this.x = this.startX + this.direction.x * radius * speed;
            this.y = this.startY + this.direction.y * radius * speed;
          } else {
            // Mouvement vers le joueur en phase 2
            const direction = new Phaser.Math.Vector2( this.player.x - this.x,  this.player.y - this.y).normalize();
            this.body.setVelocity(direction.x * this.moveSpeedPhase2, direction.y * this.moveSpeedPhase2);
      
            // Arrêter de tourner en rond
            this.rotation = 0;
          }
        } else {
          // Si le joueur est hors de portée de détection, ne rien faire
          this.body.setVelocity(0);
      
          // Arrêter de tourner en rond
          this.rotation = 0;
        }
      }
      
}      