import Player from "./Player";
import database from "../database";
import throttle from "lodash.throttle";

export default class RealtimePlayer extends Player {
  setupRealtime() {
    database.ref(this.getPlayerKey("movement")).on("value", (snap) => {
      let data = snap.val();
      this.moveToX(data.x || 0);
      this.moveToY(data.y || 0);
      this.anims.play(data.animation || "player-face-right", true);
      this.dead = data.dead;
      this.playDead();
    });
    database.ref(this.getPlayerKey("score")).on("value", (snap) => {
      this.score = snap.val() || 0;
      this.updateScore && this.updateScore();
    });
    database.ref(this.getPlayerKey("bullets")).on("value", (snap) => {
      this.setBullets(snap.val() || 0);
    });

    ["moveRight", "moveLeft", "moveUp", "moveDown", "stop"].forEach((method) => {
      this[method] = this[method].bind(this);
      this[method] = throttle(this[method], 10);
    });
  }

  updateScore() {}

  setBullets(val) {}

  moveRight() {
    let finalX = this.x + this.speed;
    database.ref(this.getPlayerKey("movement")).update({
      x: finalX,
      animation: "player-walk-right",
    });
  }

  moveLeft() {
    let finalX = this.x - this.speed;
    database.ref(this.getPlayerKey("movement")).update({
      x: finalX,
      animation: "player-walk-left",
    });
  }

  moveUp() {
    let finalY = this.y - this.speed;
    database.ref(this.getPlayerKey("movement")).update({
      y: finalY,
      animation: "player-walk-up",
    });
  }

  moveDown() {
    let finalY = this.y + this.speed;
    database.ref(this.getPlayerKey("movement")).update({
      y: finalY,
      animation: "player-walk-down",
    });
  }

  stop() {
    if (this.anims.currentAnim) {
      let direction = this.anims.currentAnim.key.split("-").pop();
      if (["up", "down", "left", "right"].includes(direction)) {
        database.ref(this.getPlayerKey("movement/animation")).set(`player-face-${direction}`);
      }
    }
  }

  die() {
    database.ref(this.getPlayerKey("movement/dead")).set(true);
  }

  getPlayerKey(parts) {
    return parts;
  }
}
