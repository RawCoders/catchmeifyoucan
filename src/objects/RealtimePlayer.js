import Player from "./Player";
import database from "../database";

export default class RealtimePlayer extends Player {
  setupRealtime() {
    database.ref(this.getPlayerKey("x")).on("value", (snap) => {
      this.moveToX(snap.val() || 0);
    });
    database.ref(this.getPlayerKey("y")).on("value", (snap) => {
      this.moveToY(snap.val() || 0);
    });
  }
  moveRight() {
    let finalX = this.x + this.speed;
    database.ref(this.getPlayerKey("x")).set(finalX);
  }

  moveLeft() {
    let finalX = this.x - this.speed;
    database.ref(this.getPlayerKey("x")).set(finalX);
  }

  moveUp() {
    let finalY = this.y - this.speed;
    database.ref(this.getPlayerKey("y")).set(finalY);
  }

  moveDown() {
    let finalY = this.y + this.speed;
    database.ref(this.getPlayerKey("y")).set(finalY);
  }

  getPlayerKey(parts) {
    return parts;
  }
}
