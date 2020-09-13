import Phaser from "phaser";
import database from "../database";
import { v4 as uuidv4 } from "uuid";
import { getUser } from "../getUser";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("title-scene");
  }

  preload() {}

  create() {
    this.positions = [100, 200, 300, 400, 500].sort(() => Math.random() - 0.5); // shuffle
    this.add
      .text(this.game.scale.width/2, this.game.scale.height/2 - 60, "Catch Me If You Can", {
        fontSize: "32px",
        color: "#000",
      })
      .setOrigin(0.5, 0);

    let createGameText = this.add
      .text(this.game.scale.width/2, this.game.scale.height/2, "Death Race", {
        fontSize: "16px",
        color: "#000",
      })
      .setOrigin(0.5, 0);
    createGameText.setInteractive({ useHandCursor: true });
    createGameText.on("pointerdown", () => {
      let username = getUser();
      let mode = "race";
      this.createNewGame(username, mode).then((uuid) => {
        window.location.href = `?id=${uuid}`;
      });
    });
  }

  createNewGame(username, mode) {
    let uuid = uuidv4();
    let npcs = this.getNPCs(2, 'moveAhead');
    return database
      .ref(`games/${uuid}`)
      .set({
        uuid: uuid,
        status: "not-started",
        mode,
        createdBy: username,
        players: {
          [username]: {
            sniper: 1,
            x: 0,
            y: this.positions.pop(),
          },
        },
        gameDetails: {
          waitingForPlayers: true
        },
        npcs: npcs
      })
      .then(() => {
        return uuid;
      });
  }

  getNPCs(count, story) {
    let npcs = []
    Array.from(Array(count)).forEach(() => {
      npcs.push({x: 0, y: this.positions.pop(), story, animation: 'player-face-right'})
    })
    return npcs
  }
}
