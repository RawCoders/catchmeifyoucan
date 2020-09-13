import Phaser from "phaser";
import GameScene from "./GameScene";
import database from "../database";
import { getUser } from "../getUser";
import RealPlayer from "../objects/RealPlayer";
import NPC from "../objects/NPC";

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
    this.npcs = [];

    if (this.gameData.gameDetails && this.gameData.gameDetails.gameStarted && !this.gameData.players[this.username]) {
        alert("The game has begun!")
        return
    }
    if (!this.gameData.players[this.username]) {
      let value = window.confirm("Join Game?");
      if (value) {
        database
          .ref("games/" + this.gameData.uuid + "/players/" + this.username)
          .set({
            racer: 1,
            x: 0,
            y: Phaser.Math.Between(100, 600),
          });
      }
    }

    database
      .ref(`games/${this.gameData.uuid}/players`)
      .on("child_added", (snap) => {
        let username = snap.key;
        this.players.push(new RealPlayer(this, username, this.gameData.uuid));
        if (this.players.length === 2) {
          database.ref("games/" + this.gameData.uuid + "/gameDetails/waitingForPlayers").set(false)
        }
        this.findPlayer();
      })

    database
      .ref(`games/${this.gameData.uuid}/npcs`)
      .on("child_added", (snap) => {
        let data = snap.val();
        this.npcs.push(new NPC(this, snap.key, this.gameData.uuid, data.story));
      });

    database
      .ref(`games/${this.gameData.uuid}/gameDetails/gameStarted`)
      .on("value", (snap) => {
        this.gameStarted = snap.val()
      })
    this.setupWait()

  }

  findPlayer() {
    if (this.player) return;
    this.player = this.players.find(
      (player) => player.username === this.username
    );
  }

  startCounter() {
    if (this.wasCreatedByMe() && !(this.gameData.gameDetails && this.gameData.gameDetails.counter === 0)) {
      let time = 5;
      let timer = setInterval(() => {
        if (time < 0) {
          clearInterval(timer);
          database
            .ref("games/" + this.gameData.uuid + "/gameDetails/gameStarted").set(true)
        } else {
          database
            .ref("games/" + this.gameData.uuid + "/gameDetails/counter").set(time)
          time--;
        }
      }, 1000)
    }
    this.setupCounter()
  }

  wasCreatedByMe() {
    return this.gameData.createdBy === this.username;
  }

  update() {
    if (!this.gameStarted) {
      return
    }
    if (this.wasCreatedByMe()) {
      this.npcs.forEach(npc => npc.playStory());
    }
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

  setupWait() {
    let overlay = this.add.renderTexture(0, 0, this.game.scale.width, this.game.scale.height);
    overlay.fill(0x000000, 0.2);
    let waitLabel = this.add
        .text(this.game.scale.width/2, this.game.scale.height/2, "Waiting for players", {
          fontSize: "32px",
          color: "#000",
        })
        .setOrigin(0.5, 0.5);
    database
      .ref("games/" + this.gameData.uuid + "/gameDetails/waitingForPlayers")
      .on("value", (snap) => {
        if (!snap.val()) {
          waitLabel.destroy()
          overlay.destroy()
          this.startCounter()
        }
      })
  }

  setupCounter() {
    let overlay = this.add.renderTexture(0, 0, this.game.scale.width, this.game.scale.height);
    overlay.fill(0x000000, 0.2);
    let label = this.add
        .text(this.game.scale.width/2, this.game.scale.height/2 - 60, "Game Starts in", {
          fontSize: "32px",
          color: "#000",
        })
        .setOrigin(0.5, 0.5);

    let counter = this.add
        .text(this.game.scale.width/2, this.game.scale.height/2, "-", {
          fontSize: "60px",
          color: "#000",
        })
        .setOrigin(0.5, 0.5);
    let counterRef = database.ref("games/" + this.gameData.uuid + "/gameDetails/counter")
    counterRef.on("value", (snap) => {
      if (snap.val() !== null && snap.val() <= 0) {
        label.destroy();
        counter.destroy()
        overlay.destroy()
        counterRef.off()
      } else {
        counter.setText(snap.val() || '')
      }
    })
  }
}