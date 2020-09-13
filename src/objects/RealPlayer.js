import RealtimePlayer from "./RealtimePlayer";
import database from "../database";

export default class RealPlayer extends RealtimePlayer {
  /**
   * @param {import('../scenes/Race.js')} scene
   * @param {string} username
   * @param {string} uuid
   */
  constructor(scene, username, uuid) {
    super(scene, 0, 0);
    this.uuid = uuid;
    this.username = username;
    this.score = 0;
    this.bullets = 0;
    this.scene.addText(this.username, `${username}: 0`);
    database.ref(this.getPlayerKey("sniper")).once("value", (snap) => {
      if (snap.exists()) {
        this.scene.addText("bullets", `bullets: 0`);
      }
    });
    this.setupRealtime();
  }

  updateScore() {
    this.scene.updateText(this.username, `${this.username}: ${this.score}`);
  }

  incrementScore(value) {
    database.ref(this.getPlayerKey("score")).set(this.score + value);
  }

  shoot() {
    if (this.bullets > 0) {
      database.ref(this.getPlayerKey("bullets")).set(this.bullets - 1);
      return true;
    }
    return false;
  }

  updateBullets() {
    this.scene.updateText("bullets", `bullets: ${this.bullets}`);
    if (this.bullets === 0) {
      this.scene.removeText("bullets");
    }
  }

  getPlayerKey(parts) {
    // prettier-ignore
    return `games/${this.uuid}/players/${this.username}${parts ? "/" + parts : ""}`;
  }
}
