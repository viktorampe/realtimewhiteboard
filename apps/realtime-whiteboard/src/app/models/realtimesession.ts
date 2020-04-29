import Player from './player';
import { RealtimeWhiteboard } from './realtimewhiteboard';

export default class RealtimeSession {
  id: string;
  title: string;
  pincode: number;
  whiteboard: RealtimeWhiteboard;
  players: Player[];
  lives: boolean;

  constructor(sessionResponse?: any) {
    this.id = sessionResponse ? sessionResponse.id : null;
    this.title = sessionResponse ? sessionResponse.title : null;
    this.pincode = sessionResponse ? sessionResponse.pincode : null;
    this.players = sessionResponse
      ? this.setPlayers(sessionResponse.players.items)
      : null;
    this.whiteboard = sessionResponse
      ? new RealtimeWhiteboard(sessionResponse.whiteboard)
      : null;
    this.lives = true;
  }

  setPlayers(playerResponse: any[]): Player[] {
    const players: Player[] = [];
    playerResponse.forEach(pr => players.push(new Player(pr)));
    return players;
  }
}
