import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';

export class SessionHelper {
  static newWhiteboard: WhiteboardInterface = {
    title: 'realtime whiteboard',
    defaultColor: '#5D3284',
    cards: [],
    shelfCards: []
  };

  constructor() {}

  static getEmptyWhiteboardString(): string {
    return JSON.stringify(this.newWhiteboard);
  }

  static parseWhiteboard(whiteboard: string): WhiteboardInterface {
    return JSON.parse(whiteboard);
  }
}
