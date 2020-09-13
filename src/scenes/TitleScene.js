import Phaser, { Math } from "phaser";
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
      let numberOfPlayers = Number(window.prompt("Number of players"));
      if (isNaN(numberOfPlayers)) {
        numberOfPlayers = 2;
      }

      let mode = "race";
      this.createNewGame(username, mode, numberOfPlayers).then((uuid) => {
        window.location.href = `?id=${uuid}`;
      });
    });
  }

  createNewGame(username, mode, numberOfPlayers) {
    let totalPlayers = numberOfPlayers * 2;
    let positions = Array.from(Array(totalPlayers))
      .map((_, i) => (i + 1) * 50 + 100)
      .sort(() => window.Math.random() - 0.5);
    let uuid = uuidv4();
    let npcs = [];
    Array.from(Array(numberOfPlayers)).forEach(() => {
      npcs.push(this.getNPC("Jitter", positions.pop()));
    });
    let playerPosition = positions.pop();
    return database
      .ref(`games/${uuid}`)
      .set({
        uuid: uuid,
        status: "waiting-for-players",
        waitCounter: 5,
        mode,
        createdBy: username,
        numberOfPlayers,
        positions,
        players: {
          [username]: {
            sniper: 1,
            movement: {
              x: 0,
              y: playerPosition,
              animation: "player-face-right",
            },
            bullets: numberOfPlayers,
          },
        },
        npcs: npcs,
      })
      .then(() => {
        return uuid;
      });
  }

  getNPC(story, position) {
    return {
      movement: {
        x: 0,
        y: position,
        animation: "player-face-right",
      },
      story,
      delay: Phaser.Math.Between(0, 5) * 10
    };
  }
}
