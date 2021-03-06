import Phaser from "phaser";
import GameScene from "./GameScene";
import database from "../database";
import { getUser } from "../getUser";
import RealPlayer from "../objects/RealPlayer";
import NPC from "../objects/NPC";
import ScoreBoard from "../objects/ScoreBoard";

export default class Race extends GameScene {
  /** @type {{ createdBy: string; uuid: string; players: Array; status: string; waitCounter: number; numberOfPlayers: number; positions: number[] }} */
  gameData;
  /** @type {RealPlayer[]} */
  players;
  /** @type {RealPlayer} */
  player;
  cursors;
  /** @type {Phaser.GameObjects.Sprite} */
  crosshair;
  /** @type {any[]} */
  waitOverlay;

  constructor() {
    super("race-scene");
  }

  /**
   * @param {any} data
   */
  init(data) {
    this.gameData = data;
    this.status = this.gameData.status;
    this.positions = this.gameData.positions;
  }

  preload() {
    super.preload();
    this.load.image("crosshair", "crosshair.png");
    this.load.scenePlugin({
      key: "rexuiplugin",
      url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      sceneKey: "rexUI",
    });
    this.load.image("overworld", "Overworld.png");
    this.load.tilemapTiledJSON("racemap", "race-map.json");
  }

  create() {
    super.create();
    this.createMap();
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.crosshair = this.createCrosshair();
    this.scoreboard = new ScoreBoard(this);
    this.scoreboard.addText("mode", "game mode: race");

    this.players = [];
    this.username = getUser();
    this.npcs = [];

    if (this.status === "started" && !this.gameData.players[this.username]) {
      alert("The game has already begun!");
      return;
    }

    if (this.wasCreatedByMe()) {
      this.game.canvas.classList.add("crosshair");
    }

    if (!this.wasCreatedByMe()) {
      let value = window.confirm(`Join game as ${this.username}?`);

      while (this.username in this.gameData.players) {
        this.username = getUser(true, "This username is already taken. Type another one.");
      }

      let position = this.positions.pop();

      if (value) {
        database.ref("games/" + this.gameData.uuid).update({
          ["players/" + this.username]: {
            racer: 1,
            movement: {
              x: 0,
              y: position,
              animation: "player-face-right",
            },
          },
          positions: this.positions,
        });
      }
    }

    database.ref(`games/${this.gameData.uuid}/players`).on("child_added", (snap) => {
      let username = snap.key;
      let player = new RealPlayer(this, username, this.gameData.uuid);
      this.players.push(player);

      if (this.username === username) {
        this.player = player;
      }
      if (this.gameData.createdBy === username) {
        player.setVisible(false);
      }

      if (this.wasCreatedByMe()) {
        player.setInteractive();
        player.on("pointerdown", () => {
          if (player.username !== this.username && this.player.shoot()) {
            player.die();
            this.player.incrementScore(10);
            this.player.showAlert(`You killed ${player.username}!`);
          }
        });
      }

      if (this.wasCreatedByMe() && this.players.length === this.gameData.numberOfPlayers) {
        setTimeout(() => {
          database.ref("games/" + this.gameData.uuid + "/status").set("counting");
        }, 2000);
      }

      let waitLabel = this.waitOverlay[1];
      if (waitLabel.visible) {
        waitLabel.setText(this.getWaitingText());
      }
    });

    database.ref(`games/${this.gameData.uuid}/npcs`).on("child_added", (snap) => {
      let data = snap.val();
      let npc = new NPC(this, snap.key, this.gameData.uuid, data.story, data.delay);
      this.npcs.push(npc);

      if (this.wasCreatedByMe()) {
        npc.setInteractive();
        npc.on("pointerdown", () => {
          if (this.player.shoot()) {
            npc.die();
            this.player.incrementScore(-20);
            this.player.showAlert("You killed a civilian ☹️");
          }
        });
      }
    });

    database.ref(`games/${this.gameData.uuid}/status`).on("value", (snap) => {
      this.status = snap.val();

      if (this.status === "counting") {
        this.waitOverlay.forEach((child) => child.destroy());
        this.startCounter();
      }
    });

    database.ref(`games/${this.gameData.uuid}/positions`).on("value", (snap) => {
      this.positions = snap.val();
    });

    this.waitOverlay = this.setupWaitOverlay();
  }

  createMap() {
    let map = this.make.tilemap({ key: "racemap" });
    let tileset = map.addTilesetImage("cmiyc", "overworld");
    map.createStaticLayer("layer-1-grass", tileset);
    map.createStaticLayer("layer-2-decoration", tileset);
    map.createStaticLayer("houses", tileset);
    map.createStaticLayer("race-track", tileset);
    map.createStaticLayer("water", tileset);
    map.createStaticLayer("water-bridge", tileset);
  }

  addText(key, val) {
    this.scoreboard.addText(key, val);
  }

  updateText(key, val) {
    this.scoreboard.updateText(key, val);
  }

  removeText(key) {
    this.scoreboard.removeText(key);
  }

  createCrosshair() {
    let crosshair = this.add.sprite(400, 300, "crosshair");
    crosshair.setScale(0.25);
    this.input.on("pointerdown", () => this.input.mouse.requestPointerLock());

    this.input.on("pointermove", (pointer) => {
      if (this.input.mouse.locked) {
        crosshair.x += pointer.movementX;
        crosshair.y += pointer.movementY;
        crosshair.x = Phaser.Math.Wrap(crosshair.x, 0, this.game.renderer.width);
        crosshair.y = Phaser.Math.Wrap(crosshair.y, 0, this.game.renderer.height);
      }
    });

    this.input.on("pointerdown", (pointer) => {
      if (this.input.mouse.locked) {
        this.players.forEach((player) => {
          let bounds = player.getBounds();
          console.log(bounds, pointer.position);
          if (bounds.contains(pointer.position.x, pointer.position.y)) {
            console.log("player hit with crosshair");
          }
        });
      }
    });

    this.input.keyboard.on("keydown-Q", () => {
      if (this.input.mouse.locked) {
        this.input.mouse.releasePointerLock();
      }
    });

    crosshair.setDepth(1000);
    return crosshair;
  }

  startCounter() {
    if (this.wasCreatedByMe()) {
      let waitCounter = this.gameData.waitCounter;
      let timer = setInterval(() => {
        if (waitCounter < 0) {
          clearInterval(timer);
          if (this.wasCreatedByMe()) {
            this.setupResetButton();
            database.ref("games/" + this.gameData.uuid + "/status").set("started");
          }
        } else {
          database.ref("games/" + this.gameData.uuid + "/waitCounter").set(waitCounter);
          waitCounter--;
        }
      }, 1000);
    }
    this.setupCounter();
  }

  setupResetButton() {
    let gameData = JSON.parse(JSON.stringify(this.gameData))
    let resetButton = this.add
      .text(this.game.scale.width - 50 , 10, "Restart Round", {
        fontSize: "12px",
        color: "#000",
      })
      .setOrigin(0.5, 0);
    resetButton.setInteractive({ useHandCursor: true });
    resetButton.on("pointerdown", () => {
      database.ref("games/" + this.gameData.uuid).set(gameData)
      resetButton.destroy()
    });
  }

  wasCreatedByMe() {
    return this.gameData.createdBy === this.username;
  }

  update() {
    if (this.status !== "started") {
      return;
    }
    if (this.wasCreatedByMe()) {
      this.npcs.forEach((npc) => npc.playStory());
    }

    if (!this.player) {
      return;
    }

    if (this.wasCreatedByMe()) {
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

  setupWaitOverlay() {
    let overlay = this.add.renderTexture(0, 0, this.game.scale.width, this.game.scale.height);
    overlay.fill(0xdddddd, 1);
    overlay.setDepth(900);

    let waitLabel = this.add
      .text(this.game.scale.width / 2, this.game.scale.height / 2, this.getWaitingText(), {
        fontSize: "24px",
        color: "#000",
      })
      .setOrigin(0.5, 0.5);
    waitLabel.setDepth(901);

    return [overlay, waitLabel];
  }

  getWaitingText() {
    let n = this.gameData.numberOfPlayers - this.players.length;
    return [
      n > 0 ? `Waiting for ${n} more player${n > 1 ? "s" : ""} to join` : "Game will start soon",
      "",
      "Sniper: " + this.gameData.createdBy,
      "Racers: " +
        this.players
          .filter((p) => !p.bullets)
          .map((p) => p.username)
          .join(","),
    ];
  }

  setupCounter() {
    let overlay = this.add.renderTexture(0, 0, this.game.scale.width, this.game.scale.height);
    overlay.fill(0x000000, 0.2);
    let label = this.add
      .text(this.game.scale.width / 2, this.game.scale.height / 2 - 60, "Game Starts in", {
        fontSize: "32px",
        color: "#000",
      })
      .setOrigin(0.5, 0.5);

    let counter = this.add
      .text(this.game.scale.width / 2, this.game.scale.height / 2, "-", {
        fontSize: "60px",
        color: "#000",
      })
      .setOrigin(0.5, 0.5);
    let counterRef = database.ref("games/" + this.gameData.uuid + "/waitCounter");
    counterRef.on("value", (snap) => {
      const counterValue = snap.val();
      if (counterValue <= 0) {
        label.destroy();
        counter.destroy();
        overlay.destroy();
        counterRef.off();
      } else {
        counter.setText(counterValue || "");
      }
    });
  }
}
