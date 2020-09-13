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
    database.ref(this.getPlayerKey("animation")).on("value", (snap) => {
      this.anims.play(snap.val() || "player-face-right", true);
    });
  }
  moveRight() {
    let finalX = this.x + this.speed;
    database.ref(this.getPlayerKey("x")).set(finalX);
    database.ref(this.getPlayerKey("animation")).set('player-walk-right');
  }

  moveLeft() {
    let finalX = this.x - this.speed;
    database.ref(this.getPlayerKey("x")).set(finalX);
    database.ref(this.getPlayerKey("animation")).set('player-walk-left');
  }

  moveUp() {
    let finalY = this.y - this.speed;
    database.ref(this.getPlayerKey("y")).set(finalY);
    database.ref(this.getPlayerKey("animation")).set('player-walk-up');
  }

  moveDown() {
    let finalY = this.y + this.speed;
    database.ref(this.getPlayerKey("y")).set(finalY);
    database.ref(this.getPlayerKey("animation")).set('player-walk-down');
  }

  stop() {
    if (this.anims.currentAnim) {
      let direction = this.anims.currentAnim.key.split('-').pop()
      if (["up", "down", "left", "right"].includes(direction)) {
        database.ref(this.getPlayerKey("animation")).set(`player-face-${direction}`)
      }
    }
  }

  getPlayerKey(parts) {
    return parts;
  }
}
