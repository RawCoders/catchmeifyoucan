import RealtimePlayer from "./RealtimePlayer";
import database from "../database";

export default class RealPlayer extends RealtimePlayer {
  constructor(scene, username, uuid) {
    super(scene, 0, 0);
    this.uuid = uuid;
    this.username = username;
    this.score = 0;
    this.bullets = 0;
    this.scene.scoreboard.addText(this.username, `${username}: 0`);
    this.scene.scoreboard.addText("bullets", `bullets: 0`);
    this.setupRealtime();
  }

  updateScore() {
    this.scene.scoreboard.updateText(this.username, `${this.username}: ${this.score}`);
  }

  incrementScore(value) {
    database.ref(this.getPlayerKey("score")).set(this.score + value);
  }

  shoot() {
    if (this.bullets > 0) {
      this.setBullets(this.bullets - 1);
      database.ref(this.getPlayerKey("bullets")).set(this.bullets);
      return true;
    }
    return false;
  }

  setBullets(bullets) {
    this.bullets = bullets;
    this.scene.scoreboard.updateText("bullets", `bullets: ${this.bullets}`);
  }

  getPlayerKey(parts) {
    // prettier-ignore
    return `games/${this.uuid}/players/${this.username}${parts ? "/" + parts : ""}`;
  }
}
