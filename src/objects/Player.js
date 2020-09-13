import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    super(
      scene,
      x,
      y,
      "player"
      // "Front/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_000.png"
    );
    this.scene = scene;
    this.steps = 0;
    this.dead = false;
    this.createAnimations();
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  get speed() {
    return this.dead ? 0 : 1;
  }

  moveToX(x) {
    this.setX(x);
  }

  moveToY(y) {
    this.setY(y);
  }

  moveRight() {
    this.setX(this.x + this.speed);
    this.anims.play("player-walk-right", true);
  }

  moveLeft() {
    this.setX(this.x - this.speed);
    this.anims.play("player-walk-left", true);
  }

  moveUp() {
    this.setY(this.y - this.speed);
    this.anims.play("player-walk-up", true);
  }

  moveDown() {
    this.setY(this.y + this.speed);
    this.anims.play("player-walk-down", true);
  }

  moveRandom() {
    if (this.steps % (this.randomStepCount || 100) === 0) {
      this.nextMove = [this.moveDown, this.moveUp, this.moveRight, this.moveLeft][Math.floor(Math.random() * 4)].bind(
        this
      );
      this.steps = 0;
      this.randomStepCount = [120, 90, 50, 60][Math.floor(Math.random() * 4)];
    }
    this.nextMove();
    this.steps += 1;
  }

  faceFront() {
    this.anims.play("player-face-front", true);
  }

  stop() {
    let middleFrameIndex = Math.ceil(this.anims.currentAnim.frames.length / 2);
    let currentFrameIndex = this.anims.currentFrame.index;
    if (currentFrameIndex === 1 || middleFrameIndex < currentFrameIndex) {
      this.anims.pause(this.anims.currentAnim.frames[0]);
    } else {
      this.anims.pause(this.anims.currentAnim.frames[middleFrameIndex]);
    }
  }

  die() {
    this.dead = true;
    let dir = String(this.anims.currentFrame.textureFrame).split("/")[0];
    let direction = {
      Left_Side: "left",
      Front: "down",
      Back: "up",
      Right_Side: "right",
    }[dir];
    this.play(`player-died-${direction}`, true);
    this.anims.stopOnRepeat();
  }

  createAnimations() {
    ["up", "down", "left", "right"].forEach((dir) => {
      let direction = {
        up: "Back",
        down: "Front",
        left: "Left_Side",
        right: "Right_Side",
      }[dir];
      this.scene.anims.create({
        key: `player-walk-${dir}`,
        frames: this.scene.anims.generateFrameNames("player", {
          start: 1,
          end: 29,
          zeroPad: 3,
          prefix: `${direction}/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_`,
          suffix: ".png",
        }),
        frameRate: 29,
        repeat: -1,
      });
      this.scene.anims.create({
        key: `player-died-${dir}`,
        frames: this.scene.anims.generateFrameNames("player", {
          start: 1,
          end: 29,
          zeroPad: 3,
          prefix: `${direction}/PNG Sequences/Warrior_clothes_1/Died/0_Warrior_Died_`,
          suffix: ".png",
        }),
        frameRate: 29,
        repeat: -1,
      });
    });

    this.scene.anims.create({
      key: "player-face-down",
      frames: [
        {
          key: "player",
          frame: "Front/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_000.png",
        },
      ],
      repeat: -1,
      frameRate: 29,
    });

    this.scene.anims.create({
      key: "player-face-right",
      frames: [
        {
          key: "player",
          frame:
            "Right_Side/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_000.png",
        },
      ],
      repeat: -1,
      frameRate: 29,
    });

    this.scene.anims.create({
      key: "player-face-left",
      frames: [
        {
          key: "player",
          frame:
            "Left_Side/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_000.png",
        },
      ],
      repeat: -1,
      frameRate: 29,
    });

    this.scene.anims.create({
      key: "player-face-up",
      frames: [
        {
          key: "player",
          frame:
            "Back/PNG Sequences/Warrior_clothes_1/Walk/0_Warrior_Walk_000.png",
        },
      ],
      repeat: -1,
      frameRate: 29,
    });
  }
}
