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

  private static getLastVersionOfCard(
    realtimeSession: RealtimeSession,
    cardId: string
  ): number {
    const card = realtimeSession.whiteboard.cards.find(c => c.id === cardId);
    return card.version;
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
    if (realtimeCard.version === undefined) {
      realtimeCard.version = 1;
    } else {
      realtimeCard.version = UpdateHelper.getLastVersionOfCard(
        currentRealtimeSession,
        realtimeCard.id
      );
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

  public static handleCardUpdate(
    card: RealtimeCard,
    activePlayer: Player
  ): string[] {
    const actions: string[] = [];
    if (card.createdBy === activePlayer.id) {
      console.log('update card');
      this.prepareCard(card);
      actions.push('UPDATE_CARD');
    } else {
      console.log('card update denied');
      actions.push('RESET_CARD');
    }
    return actions;
  }

  public static prepareCard(card: CardInterface) {
    card.left = Math.round(card.left);
    card.top = Math.round(card.top);
  }

  public static updateCardProperties(
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
}
