import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';

export class RealtimeWhiteboard implements WhiteboardInterface {
  id: string;
  title: string;
  defaultColor: string;
  cards: CardInterface[];
  shelfCards: CardInterface[];
  version: number;

  constructor(whiteboardResponse?: any) {
    this.id = whiteboardResponse ? whiteboardResponse.id : null;
    this.title = whiteboardResponse ? whiteboardResponse.title : null;
    this.defaultColor = whiteboardResponse
      ? whiteboardResponse.defaultColor
      : null;
    this.cards = whiteboardResponse
      ? this.setWorkspaceCards(whiteboardResponse.cards.items)
      : null;
    this.shelfCards = whiteboardResponse
      ? this.setShelfCards(whiteboardResponse.cards.items)
      : null;
    this.version = whiteboardResponse ? whiteboardResponse._version : null;
  }

  setWorkspaceCards(cardResponse: any[]): CardInterface[] {
    const cards: CardInterface[] = [];
    return cards;
  }
  setShelfCards(cardResponse: any[]): CardInterface[] {
    const cards: CardInterface[] = [];
    return cards;
  }
}
