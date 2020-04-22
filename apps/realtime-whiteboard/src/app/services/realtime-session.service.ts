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
  currentRealtimeSession: RealtimeSession;

  constructor(private apiService: APIService) {}

  public setCurrentRealtimeSession(realtimeSession: RealtimeSession) {
    this.currentRealtimeSession$.next(realtimeSession);
    this.currentRealtimeSession = realtimeSession;
  }

  createNewSession(
    realtimeSession: RealtimeSession
  ): Observable<RealtimeSession> {
    return from(
      this.apiService.CreateSession({
        title: realtimeSession.title,
        pincode: realtimeSession.pincode,
        whiteboard: JSON.stringify(realtimeSession.whiteboard)
      })
    ).pipe(
      // get created session
      map(sessionResponse => {
        // add players to session
        realtimeSession.players.forEach(player => {
          this.apiService
            .CreatePlayer({
              sessionID: sessionResponse.id,
              fullName: player.fullName
            })
            .catch(err => console.log(err));
        });
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
        pincode: realtimeSession.pincode,
        whiteboard: JSON.stringify(realtimeSession.whiteboard)
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
        this.currentRealtimeSession.deleted = true;
        this.setCurrentRealtimeSession(this.currentRealtimeSession);
      }
    });
  }

  /* ============== Interface Implementation ============== */

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
        pincode: this.currentRealtimeSession.pincode,
        whiteboard: JSON.stringify(whiteboard)
      })
    ).pipe(mapTo(true));
  }

  uploadFile(file: File): Observable<ImageInterface> {
    throw new Error('Method not implemented.');
  }

  /* ============== Interface Implementation ============== */
}

/*


  getSession(sessionId: string): Observable<RealtimeSession> {
    return from(this.apiService.GetSession(sessionId)).pipe(
      map(sessionResponse => {
        return new RealtimeSession(sessionResponse);
      })
    );
  }


  updateSession(realtimeSession: RealtimeSession): Observable<boolean> {
    return from(
      this.apiService.UpdateSession({
        id: realtimeSession.id,
        title: realtimeSession.title,
        pincode: realtimeSession.pincode,
        whiteboard: JSON.stringify(realtimeSession.whiteboard)
      })
    ).pipe(mapTo(true));
  }


  getPlayersBySession(sessionId: string): Observable<Player[]> {
    return from(this.apiService.PlayerBySessionId(sessionId)).pipe(
      map(playersResponse => {
        const players: Player[] = [];
        playersResponse.items.forEach(pr => {
          players.push(new Player(pr));
        });
        return players;
      })
    );
  }


*/
