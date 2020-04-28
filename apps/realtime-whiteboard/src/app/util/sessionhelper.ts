import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';

export class SessionHelper {
  constructor() {}

  public static getWhiteboardFromResponse(
    whiteboardResponse: any
  ): WhiteboardInterface {
    let whiteboard: WhiteboardInterface = {
      title: whiteboardResponse.title,
      defaultColor: whiteboardResponse.defaultColor,
      cards: [],
      shelfCards: []
      // TODO: split shelf cards from cards
    };
    return whiteboard;
  }
}
