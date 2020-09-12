import RealtimePlayer from "./RealtimePlayer";

export default class RealPlayer extends RealtimePlayer {
  constructor(scene, username, uuid) {
    super(scene, 0, 0);
    this.uuid = uuid;
    this.username = username;
    this.setupRealtime();

  }

  getPlayerKey(parts) {
    // prettier-ignore
    console.log(`games/${this.uuid}/players/${this.username}${parts ? '/' + parts : ''}`);
    return `games/${this.uuid}/players/${this.username}${parts ? '/' + parts : ''}`;
  }
}
