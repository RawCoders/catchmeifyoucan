import Phaser from "phaser";
import Player from "../objects/Player";

export default class GameScene extends Phaser.Scene {
  /** @type {Player} */
  player;

  constructor() {
    super("game-scene");
  }

  preload() {
    this.load.multiatlas("player", "player/player-atlas.json", "player");
  }

  create() {
    this.player = new Player(this, 100, 100);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.up.isDown) {
      this.player.moveUp();
    } else if (this.cursors.down.isDown) {
      this.player.moveDown();
    } else {
      this.player.stop();
    }
  }
}
