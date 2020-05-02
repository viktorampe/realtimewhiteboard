import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { RealtimeCard } from './realtimecard';

export class RealtimeWhiteboard implements WhiteboardInterface {
  id: string;
  title: string;
  defaultColor: string;
  cards: RealtimeCard[];
  shelfCards: RealtimeCard[];
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

  setWorkspaceCards(cardResponses: any[]): RealtimeCard[] {
    if (cardResponses !== undefined)
      return cardResponses
        .filter(cr => !cr._deleted === true)
        .map(cr => new RealtimeCard(cr))
        .filter(rtc => !rtc.inShelf);
  }
  setShelfCards(cardResponses: any[]): RealtimeCard[] {
    if (cardResponses !== undefined)
      return cardResponses
        .filter(cr => !cr._deleted === true)
        .map(cr => new RealtimeCard(cr))
        .filter(rtc => rtc.inShelf);
  }
}
