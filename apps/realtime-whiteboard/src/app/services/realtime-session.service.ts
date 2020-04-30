import { Injectable } from '@angular/core';
import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import ImageInterface from 'libs/whiteboard/src/lib/models/image.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { APIService } from '../API.service';
import { RealtimeCard } from '../models/realtimecard';
import RealtimeSession from '../models/realtimesession';
import { RealtimeWhiteboard } from '../models/realtimewhiteboard';

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
  currentRealtimeSession: RealtimeSession = new RealtimeSession();

  constructor(private apiService: APIService) {}

  public setCurrentRealtimeSession(realtimeSession: RealtimeSession) {
    this.currentRealtimeSession$.next(realtimeSession);
    this.currentRealtimeSession = realtimeSession;
  }

  //#region SESSOINS

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
        this.setCurrentRealtimeSession(currentSession);
        // return session (id is required for navigation)
        return currentSession;
      })
    );
  }

  getSession(sessionId: string) {
    // get session
    this.apiService
      .GetSession(sessionId)
      .then((sessionResponse: any) => {
        const realtimeSession = new RealtimeSession(sessionResponse);
        // get whiteboard
        this.apiService
          .GetWhiteboard(realtimeSession.whiteboard.id)
          .then((whiteboardResponse: any) => {
            console.log(whiteboardResponse);
            realtimeSession.whiteboard = new RealtimeWhiteboard(
              whiteboardResponse
            );
            this.setCurrentRealtimeSession(realtimeSession);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

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

  DeleteSession(sessionId: string) {
    this.apiService
      .DeleteSession({ id: sessionId })
      .then(() => {})
      .catch(err => console.log(err));
  }

  // fetches session each time someone calls updateSession, sets behaviorSubject
  subscribeOnSessionUpdates() {
    this.apiService.OnUpdateSessionListener.subscribe((evt: any) => {
      // check if update is for currect session
      if (
        evt.value.data.onUpdateSession.id === this.currentRealtimeSession.id
      ) {
        this.setCurrentRealtimeSession(
          new RealtimeSession(evt.value.data.onUpdateSession)
        );
      }
    });
  }

  subscribeOnSessionDeletes() {
    this.apiService.OnDeleteSessionListener.subscribe((evt: any) => {
      if (
        evt.value.data.onDeleteSession.id === this.currentRealtimeSession.id
      ) {
        this.currentRealtimeSession.lives = false;
        this.setCurrentRealtimeSession(this.currentRealtimeSession);
      }
    });
  }

  //#endregion

  //#region PLAYERS

  createPlayer(fullName: string) {
    this.apiService
      .CreatePlayer({
        sessionID: this.currentRealtimeSession.id,
        fullName: fullName
      })
      .then(() => {})
      .catch(err => console.log(err));
  }

  subscribeOnCreatePlayer() {
    this.apiService.OnCreatePlayerListener.subscribe((evt: any) => {
      if (
        evt.value.data.onCreatePlayer.sessionID ===
        this.currentRealtimeSession.id
      ) {
        // refetch session -> will contain player and update behavior subject
        this.getSession(this.currentRealtimeSession.id);
      }
    });
  }

  //#endregion

  //#region WHITEBOARD

  createWhiteboard(
    whiteboard: WhiteboardInterface
  ): Observable<RealtimeWhiteboard> {
    return from(
      this.apiService.CreateWhiteboard({
        title: whiteboard.title,
        defaultColor: whiteboard.defaultColor
      })
    ).pipe(
      map(whiteboardResponse => {
        this.currentRealtimeSession.whiteboard = new RealtimeWhiteboard(
          whiteboardResponse
        );
        return this.currentRealtimeSession.whiteboard;
      })
    );
  }

  subscribeOnWhiteboardUpdates() {
    this.apiService.OnUpdateWhiteboardListener.subscribe((evt: any) => {
      if (
        evt.value.data.onUpdateWhiteboard.id ===
        this.currentRealtimeSession.whiteboard.id
      ) {
        this.currentRealtimeSession.whiteboard = new RealtimeWhiteboard(
          evt.value.data.onUpdateWhiteboard
        );
        this.setCurrentRealtimeSession(this.currentRealtimeSession);
      }
    });
  }

  //#endregion

  //#region CARDS

  createCard(card: CardInterface) {
    this.apiService
      .CreateCard({
        id: card.id,
        whiteboardID: this.currentRealtimeSession.whiteboard.id,
        mode: 1, // Save in database as IDLE
        type: card.type,
        color: card.color,
        image: 'myUrl',
        top: card.type,
        left: card.left,
        viewModeImage: card.viewModeImage,
        inShelf: false
      })
      .then(() => {})
      .catch(err => console.log(err));
  }

  subscribeOnCreateCard() {
    this.apiService.OnCreateCardListener.subscribe((evt: any) => {
      const cardResponse: RealtimeCard = new RealtimeCard(
        evt.value.data.onCreateCard
      );

      if (
        this.currentRealtimeSession.whiteboard.id === cardResponse.whiteboardId
      ) {
        this.currentRealtimeSession.whiteboard.cards.push(cardResponse);
        this.setCurrentRealtimeSession(this.currentRealtimeSession);
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
        this.currentRealtimeSession.whiteboard.id === cardResponse.whiteboardId
      ) {
        let cardToUpdate = this.currentRealtimeSession.whiteboard.cards.find(
          c => c.id === cardResponse.id
        );

        // update necessary properties
        cardToUpdate.color = cardResponse.color;
        cardToUpdate.description = cardResponse.description;
        cardToUpdate.image = cardResponse.image;
        cardToUpdate.top = cardResponse.top;
        cardToUpdate.left = cardResponse.left;
        cardToUpdate.viewModeImage = cardResponse.viewModeImage;
        cardToUpdate.version = cardResponse.version;
        this.setCurrentRealtimeSession(this.currentRealtimeSession);
      }
    });
  }

  subscribeOnDeleteCard() {
    this.apiService.OnDeleteCardListener.subscribe((evt: any) => {
      const cardResponse: RealtimeCard = new RealtimeCard(
        evt.value.data.onUpdateCard
      );
      if (
        this.currentRealtimeSession.whiteboard.id === cardResponse.whiteboardId
      ) {
        this.currentRealtimeSession.whiteboard.cards.filter(
          c => c.id != cardResponse.id
        );
        this.setCurrentRealtimeSession(this.currentRealtimeSession);
      }
    });
  }

  updateCard(card: CardInterface) {
    // can't save empty string
    if (card.description === null || card.description.length < 1)
      card.description = 'empty';

    // update necessary properties
    this.apiService
      .UpdateCard({
        id: card.id,
        color: card.color,
        description: card.description,
        image: 'myUrl',
        top: card.top,
        left: card.left,
        mode: 1, // always save card as IDLE mode
        viewModeImage: card.viewModeImage,
        _version: this.currentRealtimeSession.whiteboard.cards.find(
          c => c.id === card.id
        ).version
      })
      .then(() => {})
      .catch(err => console.log(err));
  }

  deleteCard(card: RealtimeCard) {
    this.apiService
      .DeleteCard({
        id: card.id,
        _version: card.version
      })
      .then(() => {})
      .catch(err => console.log(err));
  }

  //#endregion

  //#region INTERFACE IMPLEMENTATION

  getWhiteboardData(): Observable<WhiteboardInterface> {
    return from(
      this.apiService.GetSession(this.currentRealtimeSession.id)
    ).pipe(
      map(sessionResponse => {
        return new RealtimeSession(sessionResponse).whiteboard;
      })
    );
  }

  updateWhiteboardData(
    updatedWhiteboard: WhiteboardInterface
  ): Observable<Boolean> {
    return from(
      this.apiService.UpdateWhiteboard({
        id: this.currentRealtimeSession.whiteboard.id,
        title: updatedWhiteboard.title,
        defaultColor: updatedWhiteboard.defaultColor,
        _version: this.currentRealtimeSession.whiteboard.version
      })
    ).pipe(mapTo(true));
  }

  uploadFile(file: File): Observable<ImageInterface> {
    throw new Error('Method not implemented.');
  }

  //#endregion
}
