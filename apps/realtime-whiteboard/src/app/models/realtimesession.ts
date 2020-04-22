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

  constructor(sessionResponse?: any) {
    this.id = sessionResponse ? sessionResponse.id : null;
    this.title = sessionResponse ? sessionResponse.title : null;
    this.pincode = sessionResponse ? sessionResponse.pincode : null;
    this.players = sessionResponse
      ? this.setPlayers(sessionResponse.players.items)
      : null;
    this.whiteboard = sessionResponse
      ? SessionHelper.parseWhiteboard(sessionResponse.whiteboard)
      : null;
    this.deleted = false;
  }

  setPlayers(playerResponse: any[]): Player[] {
    const players: Player[] = [];
    playerResponse.forEach(pr => players.push(new Player(pr)));
    return players;
  }
}
