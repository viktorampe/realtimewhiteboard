import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import { RealtimeCard } from '../models/realtimecard';
import RealtimeSession from '../models/realtimesession';

export class UpdateHelper {
  public static checkIfSessionHasCard(
    realtimeSession: RealtimeSession,
    card: CardInterface
  ): boolean {
    return realtimeSession.whiteboard.cards.map(c => c.id).includes(card.id);
  }

  private static getLastVersionOfCard(
    realtimeSession: RealtimeSession,
    cardId: string
  ): number {
    return realtimeSession.whiteboard.cards.find(c => c.id === cardId).version;
  }

  // if version undefined set to 1 else get last version (A newly created card does not have a version)
  public static setVersionOfCard(
    currentRealtimeSession: RealtimeSession,
    realtimeCard: RealtimeCard
  ) {
    if (realtimeCard.version === undefined) {
      realtimeCard.version = 1;
    } else {
      realtimeCard.version = UpdateHelper.getLastVersionOfCard(
        currentRealtimeSession,
        realtimeCard.id
      );
    }
  }

  public static checkDescription(realtimeCard: RealtimeCard) {
    if (
      realtimeCard.description === null ||
      realtimeCard.description.length < 1
    ) {
      realtimeCard.description = 'empty';
    }
  }
}
