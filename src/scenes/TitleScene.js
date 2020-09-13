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
      .text(this.game.scale.width / 2, this.game.scale.height / 2 - 60, "Catch Me If You Can", {
        fontSize: "32px",
        color: "#000",
      })
      .setOrigin(0.5, 0);

    let createGameText = this.add
      .text(this.game.scale.width / 2, this.game.scale.height / 2, "Death Race", {
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
    let npcs = this.getNPCs(2, "moveAhead");
    return database
      .ref(`games/${uuid}`)
      .set({
        uuid: uuid,
        status: "waiting-for-players",
        waitCounter: 5,
        mode,
        createdBy: username,
        players: {
          [username]: {
            sniper: 1,
            movement: {
              x: 0,
              y: this.positions.pop(),
              animation: "player-face-right",
            },
            bullets: 3,
          },
        },
        npcs: npcs,
      })
      .then(() => {
        return uuid;
      });
  }

  getNPCs(count, story) {
    let npcs = [];
    Array.from(Array(count)).forEach(() => {
      npcs.push({
        movement: {
          x: 0,
          y: this.positions.pop(),
          animation: "player-face-right",
        },
        story,
      });
    });
    return npcs;
  }
}
