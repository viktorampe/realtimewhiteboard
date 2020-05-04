import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { RealtimeCard } from '../models/realtimecard';
import RealtimeSession from '../models/realtimesession';
import { RealtimeWhiteboard } from '../models/realtimewhiteboard';

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
    const card = realtimeSession.whiteboard.cards.find(c => c.id === cardId);
    return card.version;
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

  public static handleWhiteboardUpdate(
    currentWhiteboard: RealtimeWhiteboard,
    updatedWhiteboard: WhiteboardInterface
  ): string[] {
    const actions: string[] = [];
    // title / defaultcolor changed
    if (
      currentWhiteboard.title !== updatedWhiteboard.title ||
      currentWhiteboard.defaultColor !== updatedWhiteboard.defaultColor
    ) {
      console.log('updateWhiteboard');
      actions.push('UPDATE_WHITEBOARD');
    }

    // card was added
    if (currentWhiteboard.cards.length < updatedWhiteboard.cards.length) {
      console.log('create card');
      actions.push('CREATE_CARD');
    }

    // card was deleted
    if (currentWhiteboard.cards.length > updatedWhiteboard.cards.length) {
      console.log('delete card');
      actions.push('DELETE_CARD');
    }

    return actions;
  }
}
