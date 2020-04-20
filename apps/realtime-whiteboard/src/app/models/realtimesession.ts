import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { SessionHelper } from '../util/sessionhelper';
import { PlayerInterface } from './player.interface';

export default class RealtimeSession {
  id: string;
  title: string;
  pincode: number;
  whiteboard: WhiteboardInterface;
  players: PlayerInterface[];

  constructor(sessionResponse: any) {
    this.id = sessionResponse.id;
    this.title = sessionResponse.title;
    this.pincode = sessionResponse.pincode;
    this.whiteboard = SessionHelper.parseWhiteboard(sessionResponse.whiteboard);
  }
}
