import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import Player from '../models/player';
import { RealtimeCard } from '../models/realtimecard';
import RealtimeSession from '../models/realtimesession';
import { RealtimeWhiteboard } from '../models/realtimewhiteboard';

export class UpdateHelper {
  private static getLastVersionOfPlayer(
    realtimeSession: RealtimeSession,
    playerId: string
  ): number {
    const player = realtimeSession.players.find(p => p.id === playerId);
    return player.version;
  }

  // if version undefined set to 1 else get last version (A newly created card does not have a version)
  public static setVersionOfCard(
    currentRealtimeSession: RealtimeSession,
    realtimeCard: RealtimeCard
  ) {
    realtimeCard.version = currentRealtimeSession.whiteboard.cards.find(
      c => c.id === realtimeCard.id
    ).version;
    if (realtimeCard.version === undefined) {
      realtimeCard.version = 1;
    }
  }

  public static setVersionOfPlayer(
    currentRealtimeSession: RealtimeSession,
    player: Player
  ) {
    if (player.version === undefined) {
      player.version = 1;
    } else {
      player.version = UpdateHelper.getLastVersionOfPlayer(
        currentRealtimeSession,
        player.id
      );
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
      actions.push('UPDATE_WHITEBOARD');
    }

    // card was added
    if (currentWhiteboard.cards.length < updatedWhiteboard.cards.length) {
      actions.push('CREATE_CARD');
    }

    // card was deleted
    if (currentWhiteboard.cards.length > updatedWhiteboard.cards.length) {
      actions.push('DELETE_CARD');
    }

    return actions;
  }

  public static prepareCard(card: CardInterface) {
    card.left = Math.round(card.left);
    card.top = Math.round(card.top);
  }

  public static updateRealtimeCardPropertiesFromCardInterface(
    realtimeCard: RealtimeCard,
    CardInterface: CardInterface
  ) {
    realtimeCard.color = CardInterface.color;
    realtimeCard.description = CardInterface.description;
    realtimeCard.image = CardInterface.image;
    realtimeCard.top = CardInterface.top;
    realtimeCard.left = CardInterface.left;
    realtimeCard.viewModeImage = CardInterface.viewModeImage;
  }
}
