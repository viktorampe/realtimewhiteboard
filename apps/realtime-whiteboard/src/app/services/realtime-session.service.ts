import { Injectable } from '@angular/core';
import ImageInterface from 'libs/whiteboard/src/lib/models/image.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { APIService } from '../API.service';
import RealtimeSession from '../models/realtimesession';

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
    this.apiService
      .GetSession(sessionId)
      .then(sessionResponse => {
        this.setCurrentRealtimeSession(new RealtimeSession(sessionResponse));
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

  createWhiteboard(whiteboard: WhiteboardInterface): Observable<any> {
    return from(
      this.apiService.CreateWhiteboard({
        title: whiteboard.title,
        defaultColor: whiteboard.defaultColor
      })
    ).pipe(
      map(whiteboardResponse => {
        this.currentRealtimeSession.whiteboard = {
          title: whiteboardResponse.title,
          defaultColor: whiteboardResponse.defaultColor,
          cards: whiteboardResponse.cards.items
            .filter(c => c.inShelf === false)
            .map(c => {
              return {
                id: c.id,
                mode: c.mode,
                type: c.type,
                color: c.color,
                description: c.description,
                image: {
                  imageUrl: c.image
                },
                top: c.top,
                left: c.left,
                viewModeImage: c.viewModeImage
              };
            }),
          shelfCards: whiteboardResponse.cards.items
            .filter(c => c.inShelf === true)
            .map(c => {
              return {
                id: c.id,
                mode: c.mode,
                type: c.type,
                color: c.color,
                description: c.description,
                image: {
                  imageUrl: c.image
                },
                top: c.top,
                left: c.left,
                viewModeImage: c.viewModeImage
              };
            })
        };
        return whiteboardResponse;
      })
    );
  }

  ////#endregion

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

  updateWhiteboardData(whiteboard: WhiteboardInterface): Observable<Boolean> {
    return from(
      this.apiService.UpdateSession({
        id: this.currentRealtimeSession.id,
        title: this.currentRealtimeSession.title,
        pincode: this.currentRealtimeSession.pincode
      })
    ).pipe(mapTo(true));
  }

  uploadFile(file: File): Observable<ImageInterface> {
    throw new Error('Method not implemented.');
  }

  //#endregion
}
