import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene],
  backgroundColor: '#ffffff'
});
