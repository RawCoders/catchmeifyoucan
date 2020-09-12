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
    return `games/${this.uuid}/players/${this.username}${parts ? '/' + parts : ''}`;
  }
}
