import Phaser from "phaser";
import GameScene from "./GameScene";
import database from "../database";
import { getUser } from "../getUser";
import RealPlayer from "../objects/RealPlayer";

export default class Race extends GameScene {
  /** @type {{ createdBy: string; uuid: string; players: Array }} */
  gameData;
  /** @type {RealPlayer[]} */
  players;
  /** @type {RealPlayer} */
  player;
  cursors;

  constructor() {
    super("race-scene");
  }

  /**
   * @param {any} data
   */
  init(data) {
    this.gameData = data;
  }

  create() {
    super.create();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.players = [];
    this.username = getUser();

    if (!this.gameData.players[this.username]) {
      let value = window.confirm("Join Game?");
      if (value) {
        database
          .ref("games/" + this.gameData.uuid + "/players/" + this.username)
          .set({
            racer: 1,
            x: Phaser.Math.Between(100, 800),
            y: Phaser.Math.Between(100, 600),
          });
      }
    }

    database
      .ref(`games/${this.gameData.uuid}/players`)
      .on("child_added", (snap) => {
        let username = snap.key;
        this.players.push(new RealPlayer(this, username, this.gameData.uuid));
        this.findPlayer();
      });
  }

  findPlayer() {
    if (this.player) return;
    this.player = this.players.find(
      (player) => player.username === this.username
    );
  }

  update() {
    if (!this.player) {
      return;
    }
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
