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
      database.ref(this.getPlayerKey("bullets")).set(this.bullets - 1);
      return true;
    }
    return false;
  }

  updateBullets() {
    this.scene.scoreboard.updateText("bullets", `bullets: ${this.bullets}`);
    if (this.bullets === 0) {
      this.scene.scoreboard.removeText("bullets");
    }
  }

  showAlert(text) {
    this.scene.rexUI.add.toast({
        x: this.scene.scale.width - 100,
        y: this.scene.scale.height - 50,
        background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, '#dddddd'),
        text: this.scene.add.text(0, 0, '', {
            fontSize: '16px'
        }),
        space: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10,
        },
    }).show(text)
  }

  getPlayerKey(parts) {
    // prettier-ignore
    return `games/${this.uuid}/players/${this.username}${parts ? "/" + parts : ""}`;
  }
}
