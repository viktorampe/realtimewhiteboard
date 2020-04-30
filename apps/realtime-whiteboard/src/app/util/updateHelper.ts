import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import RealtimeSession from '../models/realtimesession';

export class UpdateHelper {
  public static checkIfSessionHasCard(
    realtimeSession: RealtimeSession,
    card: CardInterface
  ): boolean {
    return realtimeSession.whiteboard.cards.map(c => c.id).includes(card.id);
  }

  public static getLastVersionOfCard(
    realtimeSession: RealtimeSession,
    cardId: string
  ): number {
    return realtimeSession.whiteboard.cards.find(c => c.id === cardId).version;
  }
}
