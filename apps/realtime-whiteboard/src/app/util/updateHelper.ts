import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import Player from '../models/player';
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

  private static getLastVersionOfPlayer(
    realtimeSession: RealtimeSession,
    playerId: string
  ) {
    const player = realtimeSession.players.find(p => p.id === playerId);
    return player.version;
  }

  // if version undefined set to 1 else get last version (A newly created card does not have a version)
  public static setVersionOfCard(
    currentRealtimeSession: RealtimeSession,
    realtimeCard: RealtimeCard
  ) {
    const cardVersion = currentRealtimeSession.whiteboard.cards.find(
      c => c.id === realtimeCard.id
    ).version;
    if (cardVersion === undefined) {
      return 1;
    } else {
      return cardVersion;
    }
  }

  public static checkDescription(realtimeCard: CardInterface) {
    if (
      realtimeCard.description === null ||
      realtimeCard.description.length < 1
    ) {
      realtimeCard.description = null;
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
    this.checkDescription(card);
    card.left = Math.round(card.left);
    card.top = Math.round(card.top);
  }

  public static updateCardPropertiesFromCardResponse(
    cardToUpdate: RealtimeCard,
    cardResponse: RealtimeCard
  ) {
    cardToUpdate.color = cardResponse.color;
    cardToUpdate.description = cardResponse.description;
    cardToUpdate.image = cardResponse.image;
    cardToUpdate.top = cardResponse.top;
    cardToUpdate.left = cardResponse.left;
    cardToUpdate.viewModeImage = cardResponse.viewModeImage;
    cardToUpdate.version = cardResponse.version;
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

  public static replaceCardinArray(
    currentRealtimeSession: RealtimeSession,
    realtimeCard: RealtimeCard
  ) {
    currentRealtimeSession.whiteboard.cards = [
      ...currentRealtimeSession.whiteboard.cards.filter(
        c => c.id !== realtimeCard.id
      ),
      realtimeCard
    ];
  }
}
