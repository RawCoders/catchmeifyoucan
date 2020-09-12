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
    this.add
      .text(400, 100, "Catch Me If You Can", {
        fontSize: "32px",
        color: "#000",
      })
      .setOrigin(0.5, 0);

    let createGameText = this.add
      .text(400, 200, "Death Race", {
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
            x: Phaser.Math.Between(100, 800),
            y: Phaser.Math.Between(100, 600),
          },
        },
      })
      .then(() => {
        return uuid;
      });
  }
}
