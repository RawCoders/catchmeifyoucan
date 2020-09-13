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

  showAlert(text) {
    this.scene.rexUI.add.toast({
        x: this.scene.scale.width - (90 + (text.length * 4)),
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
