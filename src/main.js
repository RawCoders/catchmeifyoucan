import Phaser from "phaser";
import TitleScene from "./scenes/TitleScene";
import Race from "./scenes/Race";
import database from "./database";

let game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true
    },
  },
  backgroundColor: "#ffffff",
});
window.game = game;

game.scene.add("title-scene", new TitleScene());
game.scene.add("race-scene", new Race());

let params = new URLSearchParams(window.location.search);

if (params.has("id")) {
  database.ref(`games/${params.get("id")}`).once("value", (s) => {
    let val = s.val();
    if (val && val.uuid && val.mode == "race") {
      game.scene.start("race-scene", val);
    } else {
      game.scene.start("title-scene");
    }
  });
} else {
  game.scene.start("title-scene");
}

export default game;
