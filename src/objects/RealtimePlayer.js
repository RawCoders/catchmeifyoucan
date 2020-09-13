import Player from "./Player";
import database from "../database";

export default class RealtimePlayer extends Player {
  setupRealtime() {
    database.ref(this.getPlayerKey()).on("value", (snap) => {
      let data = snap.val()
      this.moveToX(data.x || 0);
      this.moveToY(data.y || 0);
      this.anims.play(data.animation || "player-face-right", true)
    })
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
