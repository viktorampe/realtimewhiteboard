import { Injectable } from '@angular/core';
import { Storage } from 'aws-amplify';
import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import ImageInterface from 'libs/whiteboard/src/lib/models/image.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  from,
  Observable
} from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { APIService } from '../../API.service';
import Player from '../../models/player';
import { RealtimeCard } from '../../models/realtimecard';
import RealtimeSession from '../../models/realtimesession';
import { RealtimeWhiteboard } from '../../models/realtimewhiteboard';
import { UpdateHelper } from '../../util/updateHelper';
import { ActiveplayerService } from '../activeplayer/activeplayer.service';

export interface WhiteboardDataServiceInterface {
  getWhiteboardData(): Observable<WhiteboardInterface>;
  updateWhiteboardData(whiteboard: WhiteboardInterface): Observable<Boolean>;
  uploadFile(file: File): Observable<ImageInterface>;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeSessionService implements WhiteboardDataServiceInterface {
  currentRealtimeSession$ = new BehaviorSubject<RealtimeSession>(null);
  notificationSetter$ = new BehaviorSubject<string>(null);

  constructor(
    private apiService: APIService,
    private activePlayerService: ActiveplayerService
  ) {}

  private setNotification(message: string) {
    this.notificationSetter$.next(message);
  }

  //#region SUBSCRIBTIONS

  // fetches session each time someone calls updateSession, sets behaviorSubject
  subscribeOnSessionUpdates() {
    this.apiService.OnUpdateSessionListener.subscribe((evt: any) => {
      // check if update is for currect session
      if (
        evt.value.data.onUpdateSession.id ===
        this.currentRealtimeSession$.getValue().id
      ) {
        this.currentRealtimeSession$.next(
          new RealtimeSession(evt.value.data.onUpdateSession)
        );
      }
    });
  }

  subscribeOnSessionDeletes() {
    this.apiService.OnDeleteSessionListener.subscribe((evt: any) => {
      const deletedSession = new RealtimeSession(
        evt.value.data.onDeleteSession
      );
      if (deletedSession.id === this.currentRealtimeSession$.getValue().id) {
        // update behaviorSubject
        this.currentRealtimeSession$.next(deletedSession);
      }
    });
  }

  subscribeOnWhiteboardUpdates() {
    this.apiService.OnUpdateWhiteboardListener.subscribe((evt: any) => {
      const updatedWhiteboard = new RealtimeWhiteboard(
        evt.value.data.onUpdateWhiteboard
      );
      if (
        updatedWhiteboard.id ===
        this.currentRealtimeSession$.getValue().whiteboard.id
      ) {
        const realtimeSessionUpdate = this.currentRealtimeSession$.getValue();
        realtimeSessionUpdate.whiteboard = updatedWhiteboard;

        this.currentRealtimeSession$.next(realtimeSessionUpdate);
      }
    });
  }

  subscribeOnCreateCard() {
    combineLatest([
      this.activePlayerService.activePlayer$,
      this.apiService.OnCreateCardListener
    ]).subscribe(([activePlayer, evt]: [Player, any]) => {
      const cardResponse: RealtimeCard = new RealtimeCard(
        evt.value.data.onCreateCard
      );
      if (
        cardResponse.whiteboardId ===
        this.currentRealtimeSession$.getValue().whiteboard.id
      ) {
        // add card to array and update reference
        const realtimeSessionUpdate = this.currentRealtimeSession$.getValue();
        // find card to update and set to new reference
        const ownCardVersion = realtimeSessionUpdate.whiteboard.cards.find(
          c => c.id === cardResponse.id
        );
        // find card to update and set to new reference
        realtimeSessionUpdate.whiteboard.cards = [
          ...realtimeSessionUpdate.whiteboard.cards.filter(
            c => c.id !== cardResponse.id
          ),
          {
            ...cardResponse,
            mode:
              activePlayer.id === cardResponse.createdBy ? 0 : cardResponse.mode
          }
        ];
        this.currentRealtimeSession$.next(realtimeSessionUpdate);
      }
    });
  }

  subscribeOnCreatePlayer() {
    this.apiService.OnCreatePlayerListener.subscribe((evt: any) => {
      const playerResponse: Player = new Player(evt.value.data.onCreatePlayer);
      if (
        playerResponse.sessionId === this.currentRealtimeSession$.getValue().id
      ) {
        // push player in array
        const realtimeSessioUpdate = this.currentRealtimeSession$.getValue();
        realtimeSessioUpdate.players.push(playerResponse);
        this.currentRealtimeSession$.next(realtimeSessioUpdate);
        // set notification for component
        this.setNotification(`${playerResponse.fullName} joined the session.`);
      }
    });
  }

  subsribeOnDeletePlayer() {
    this.apiService.OnDeletePlayerListener.subscribe((evt: any) => {
      const playerResponse: Player = new Player(evt.value.data.onDeletePlayer);
      if (
        playerResponse.sessionId === this.currentRealtimeSession$.getValue().id
      ) {
        // remove cookie
        this.activePlayerService.deleteActivePlayer(playerResponse.id);
        // remove player from array
        if (this.currentRealtimeSession$.getValue().players) {
          const realtimeSessioUpdate = this.currentRealtimeSession$.getValue();
          realtimeSessioUpdate.players = [
            ...realtimeSessioUpdate.players.filter(
              p => p.id !== playerResponse.id
            )
          ];
          this.currentRealtimeSession$.next(realtimeSessioUpdate);
          // set notification for component
          this.setNotification(`${playerResponse.fullName} left the session.`);
        }
      }
    });
  }

  subscribeOnUpdateCard() {
    this.apiService.OnUpdateCardListener.subscribe((evt: any) => {
      const cardResponse: RealtimeCard = new RealtimeCard(
        evt.value.data.onUpdateCard
      );
      // update is for this whiteboard
      if (
        this.currentRealtimeSession$.getValue().whiteboard.id ===
        cardResponse.whiteboardId
      ) {
        const realtimeSessionUpdate = this.currentRealtimeSession$.getValue();
        // find card to update and set to new reference
        const ownCardVersion = realtimeSessionUpdate.whiteboard.cards.find(
          c => c.id === cardResponse.id
        );
        // find card to update and set to new reference
        realtimeSessionUpdate.whiteboard.cards = [
          ...realtimeSessionUpdate.whiteboard.cards.filter(
            c => c.id !== cardResponse.id
          ),
          {
            ...cardResponse,
            mode:
              ownCardVersion && ownCardVersion.mode !== cardResponse.mode
                ? ownCardVersion.mode
                : cardResponse.mode
          }
        ];

        // Delete and add cardResponse to array ()
        // UpdateHelper.replaceCardinArray(realtimeSessionUpdate, cardResponse);

        this.currentRealtimeSession$.next(realtimeSessionUpdate);
      }
    });
  }

  subscribeOnDeleteCard() {
    this.apiService.OnDeleteCardListener.subscribe((evt: any) => {
      const cardResponse: RealtimeCard = new RealtimeCard(
        evt.value.data.onDeleteCard
      );
      if (
        this.currentRealtimeSession$.getValue().whiteboard.id ===
        cardResponse.whiteboardId
      ) {
        // remove card from array with new reference
        if (this.currentRealtimeSession$.getValue().whiteboard.cards) {
          const realtimeSessionUpdate = this.currentRealtimeSession$.getValue();
          realtimeSessionUpdate.whiteboard.cards = [
            ...realtimeSessionUpdate.whiteboard.cards.filter(
              c => c.id !== cardResponse.id
            )
          ];
          this.currentRealtimeSession$.next(realtimeSessionUpdate);
        }
      }
    });
  }

  //#endregion

  //#region CREATE

  createNewSession(
    realtimeSession: RealtimeSession,
    whiteboardID: string
  ): Observable<RealtimeSession> {
    return from(
      this.apiService.CreateSession({
        title: realtimeSession.title,
        pincode: realtimeSession.pincode,
        whiteboardID: whiteboardID
      })
    ).pipe(
      // get created session
      map(sessionResponse => {
        // update behaviorSubject
        const currentSession = new RealtimeSession(sessionResponse);
        this.currentRealtimeSession$.next(currentSession);
        // return session (id is required for navigation)
        return currentSession;
      })
    );
  }

  createPlayer(player: Player): Observable<Player> {
    return from(
      this.apiService.CreatePlayer({
        sessionID: this.currentRealtimeSession$.getValue().id,
        fullName: player.fullName,
        isTeacher: player.isTeacher
      })
    ).pipe(
      map(playerResponse => {
        return new Player(playerResponse);
      })
    );
  }

  createWhiteboard(
    whiteboard: WhiteboardInterface
  ): Observable<RealtimeWhiteboard> {
    console.log('create whiteboard');
    return from(
      this.apiService.CreateWhiteboard({
        title: whiteboard.title,
        defaultColor: whiteboard.defaultColor
      })
    ).pipe(
      map(whiteboardResponse => {
        const realtimeWhiteboard = new RealtimeWhiteboard(whiteboardResponse);
        return realtimeWhiteboard;
      })
    );
  }

  createCard(card: CardInterface, player: Player) {
    console.log('create card');
    UpdateHelper.prepareCard(card);
    this.apiService
      .CreateCard({
        id: card.id,
        whiteboardID: this.currentRealtimeSession$.getValue().whiteboard.id,
        mode: 1, // Save in database as IDLE
        type: 0, // unimportant
        color: card.color,
        top: card.top,
        left: card.left,
        viewModeImage: card.viewModeImage,
        inShelf: false,
        createdBy: player.id,
        _version: 0
      })
      .then(() => {})
      .catch(err => console.log(err));
  }
  //#endregion

  //#region GET

  getSession(sessionId: string) {
    console.log('get session');
    // get session
    this.apiService
      .GetSession(sessionId)
      .then((sessionResponse: any) => {
        const realtimeSession = new RealtimeSession(sessionResponse);
        // get whiteboard
        this.apiService
          .GetWhiteboard(realtimeSession.whiteboard.id)
          .then((whiteboardResponse: any) => {
            realtimeSession.whiteboard = new RealtimeWhiteboard(
              whiteboardResponse
            );
            this.currentRealtimeSession$.next(realtimeSession);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  getWhiteboardData(): Observable<WhiteboardInterface> {
    console.log('get whiteboard');
    return from(
      this.apiService.GetSession(this.currentRealtimeSession$.getValue().id)
    ).pipe(
      map(sessionResponse => {
        return new RealtimeSession(sessionResponse).whiteboard;
      })
    );
  }

  getCard(cardId: string): Observable<RealtimeCard> {
    console.log('get card');
    return from(this.apiService.GetCard(cardId)).pipe(
      map(cardResponse => {
        return new RealtimeCard(cardResponse);
      })
    );
  }

  //#endregion

  //#region UPDATE

  updateSession(realtimeSession: RealtimeSession) {
    this.apiService
      .UpdateSession({
        id: realtimeSession.id,
        title: realtimeSession.title,
        pincode: realtimeSession.pincode
      })
      .then(() => {})
      .catch(err => console.log(err));
  }

  updateWhiteboardData(
    updatedWhiteboard: WhiteboardInterface
  ): Observable<Boolean> {
    console.log('update whiteboard');
    return from(
      this.apiService.UpdateWhiteboard({
        id: this.currentRealtimeSession$.getValue().whiteboard.id,
        title: updatedWhiteboard.title,
        defaultColor: updatedWhiteboard.defaultColor,
        _version: this.currentRealtimeSession$.getValue().whiteboard.version
      })
    ).pipe(mapTo(true));
  }

  updateCard(card: CardInterface, player: Player) {
    console.log('update card');
    // find card to update
    const realtimeCard: RealtimeCard = this.currentRealtimeSession$
      .getValue()
      .whiteboard.cards.find(c => c.id === card.id);
    // prepare card
    UpdateHelper.prepareCard(realtimeCard);
    // update realtiemCard properties
    UpdateHelper.updateRealtimeCardPropertiesFromCardInterface(
      realtimeCard,
      card
    );
    // if version undefined -> set to 1, else get last version (A newly created card does not have a version)
    /*
    UpdateHelper.setVersionOfCard(
      this.currentRealtimeSession$.getValue(),
      realtimeCard
    );*/

    // update necessary properties
    this.apiService
      .UpdateCard({
        id: realtimeCard.id,
        color: realtimeCard.color,
        description: realtimeCard.description,
        top: realtimeCard.top,
        left: realtimeCard.left,
        mode: 1, // always save card as IDLE mode
        viewModeImage: realtimeCard.viewModeImage,
        lastUpdatedBy: player.id,
        _version: realtimeCard.version
      })
      .then(() => {})
      .catch(err => console.log(err));
  }

  //#endregion

  //#region DELETE

  deleteSession(sessionId: string): Observable<boolean> {
    console.log('delete session');
    const deletePlayers$ = this.currentRealtimeSession$
      .getValue()
      .players.map(p => this.deletePlayer(p));
    const deleteCards$ = this.currentRealtimeSession$
      .getValue()
      .whiteboard.cards.map(c => this.deleteCard(c));
    const deleteWhiteboard$ = this.deleteWhiteboard(
      this.currentRealtimeSession$.getValue().whiteboard
    );

    // completes delete players, cards, whiteboard before deleting the session
    return forkJoin(deleteCards$, deletePlayers$, deleteWhiteboard$).pipe(
      map(() => {
        this.apiService.DeleteSession({
          id: sessionId,
          _version: this.currentRealtimeSession$.getValue().version
        });
      }),
      mapTo(true)
    );
  }

  deleteCard(realtimeCard: RealtimeCard): Observable<boolean> {
    console.log('delete card');
    UpdateHelper.setVersionOfCard(
      this.currentRealtimeSession$.getValue(),
      realtimeCard
    );
    return from(
      this.apiService.DeleteCard({
        id: realtimeCard.id,
        _version: realtimeCard.version
      })
    ).pipe(mapTo(true));
  }

  deletePlayer(player: Player): Observable<boolean> {
    console.log('delete player');
    UpdateHelper.setVersionOfPlayer(
      this.currentRealtimeSession$.getValue(),
      player
    );
    return from(
      this.apiService.DeletePlayer({
        id: player.id,
        _version: player.version
      })
    ).pipe(mapTo(true));
  }

  deleteWhiteboard(whiteboard: RealtimeWhiteboard): Observable<boolean> {
    console.log('delete whiteboard');
    return from(
      this.apiService.DeleteWhiteboard({
        id: whiteboard.id,
        _version: whiteboard.version
      })
    ).pipe(mapTo(true));
  }
  //#endregion

  //#region IMAGES

  uploadFile(file: File): Observable<ImageInterface> {
    console.log('upload file');
    return from(this.saveImg(file)).pipe(
      map((uploadResponse: any) => {
        return {
          imageUrl: `https://realtimewhiteboardstragebucket125040-dev.s3-eu-west-1.amazonaws.com/public/${uploadResponse.key}`,
          progress: 0
        };
      })
    );
  }

  private saveImg(file: File): Observable<any> {
    return from(
      Storage.put(file.name, file, {
        level: 'public',
        contentType: 'image/png'
      })
    ).pipe(
      map((uploadResponse: any) => {
        return uploadResponse;
      })
    );
  }

  updateCardImage(realtimeCard: RealtimeCard, url: string) {
    console.log('update card image');
    // prepare card
    UpdateHelper.prepareCard(realtimeCard);
    // if version undefined -> set to 1, else get last version (A newly created card does not have a version)
    /*
    UpdateHelper.setVersionOfCard(
      this.currentRealtimeSession$.getValue(),
      realtimeCard
    );
    */

    this.apiService
      .UpdateCard({
        id: realtimeCard.id,
        image: url,
        _version: realtimeCard.version
      })
      .then(() => {})
      .catch(err => console.log(err));
  }

  //#endregion
}
