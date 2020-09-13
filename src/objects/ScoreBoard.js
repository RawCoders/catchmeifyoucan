import Phaser from "phaser";

export default class ScoreBoard extends Phaser.GameObjects.Group {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    super(scene);
    this.scene = scene;
    this.offset = 0;
    this.textMap = {};
  }

  /**
   * @param {string} key
   * @param {string} string
   */
  addText(key, string) {
    let textObj = this.scene.add.text(0, this.offset, string, { color: "#000" });
    this.add(textObj);
    this.textMap[key] = textObj;
    this.offset += 20;
  }

  updateText(key, string) {
    let textObj = this.textMap[key];
    if (!textObj) return;

    textObj.text = string;
    textObj.update();
  }

  removeText(key) {
    let textObj = this.textMap[key];
    if (!textObj) return;
    textObj.destroy();
  }
}
