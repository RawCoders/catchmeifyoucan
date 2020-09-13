import Phaser from "phaser";

export default class ScoreBoard extends Phaser.GameObjects.Group {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    super(scene);
    this.scene = scene;
    this.textMap = {};
    this.textObj = this.scene.add.text(0, 0, "", { color: "#000" });
  }

  addText(key, string) {
    this.textMap[key] = string;
    this.updateTextObject();
  }

  updateText(key, string) {
    if (key in this.textMap) {
      this.textMap[key] = string;
      this.updateTextObject();
    }
  }

  removeText(key) {
    delete this.textMap[key];
    this.updateTextObject();
  }

  updateTextObject() {
    let strings = Object.keys(this.textMap).map((key) => this.textMap[key] + "\n");
    this.textObj.setText(strings);
  }
}
