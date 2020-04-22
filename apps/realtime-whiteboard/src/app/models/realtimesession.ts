import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { SessionHelper } from '../util/sessionhelper';
import Player from './player';

export default class RealtimeSession {
  id: string;
  title: string;
  pincode: number;
  whiteboard: WhiteboardInterface;
  players: Player[];
  deleted: boolean;

  constructor(sessionResponse: any) {
    this.id = sessionResponse.id;
    this.title = sessionResponse.title;
    this.pincode = sessionResponse.pincode;
    this.players = this.setPlayers(sessionResponse.players.items);
    this.whiteboard = SessionHelper.parseWhiteboard(sessionResponse.whiteboard);
    this.deleted = false;
  }

  setPlayers(playerResponse: any[]): Player[] {
    const players: Player[] = [];
    playerResponse.forEach(pr => players.push(new Player(pr)));
    return players;
  }
}
