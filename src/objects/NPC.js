import RealtimePlayer from "./RealtimePlayer";
import stories from "../stories";

export default class NPC extends RealtimePlayer {
  constructor(scene, npcId, uuid, story, delay=0) {
    super(scene, 0, 0);
    this.uuid = uuid;
    this.npcId = npcId;
    this.delay = delay;
    this.story = Object.assign({}, stories[story]);
    this.story.currentMovementIndex = 0;
    this.setupRealtime();
  }

  getPlayerKey(parts) {
    // prettier-ignore
    return `games/${this.uuid}/npcs/${this.npcId}${parts ? '/' + parts : ''}`;
  }

  playStory() {
    if (this.story && !this.delay) {
      if (!this.currentMovement || this.steps >= this.currentMovement.steps) {
        this.steps = 0;
        this.story.currentMovementIndex = (this.story.currentMovementIndex + 1) % this.story.movements.length;
        this.currentMovement = this.story.movements[this.story.currentMovementIndex];
      }
      if (this.currentMovement.action) {
        this[this.currentMovement.action]();
      } else if (this.currentMovement.animation && !this.dead) {
        this.playAnimation(this.currentMovement.animation)
      }
      this.steps += 1;
    } else {
      this.delay--;
    }
  }
}
