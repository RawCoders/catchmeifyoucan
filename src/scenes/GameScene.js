import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor(name) {
    super(name);
  }

  preload() {
    this.load.multiatlas("player", "player/player-atlas.json", "player");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {}
}