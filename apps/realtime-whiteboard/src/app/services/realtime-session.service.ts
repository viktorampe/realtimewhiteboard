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

  createNewSession(): Observable<RealtimeSession> {
    const realtimeSession = {
      id: null,
      title: 'New Realtime Session',
      pincode: 555555,
      whiteboard: {
        title: 'realtime whiteboard',
        defaultColor: '#5D3284',
        cards: [],
        shelfCards: []
      },
      players: [
        { id: null, sessionId: null, fullName: 'Vitkor' },
        { id: null, sessionId: null, fullName: 'Frederic' },
        { id: null, sessionId: null, fullName: 'Thomas' },
        { id: null, sessionId: null, fullName: 'Tom' },
        { id: null, sessionId: null, fullName: 'Karl' },
        { id: null, sessionId: null, fullName: 'David' },
        { id: null, sessionId: null, fullName: 'Bert' },
        { id: null, sessionId: null, fullName: 'Yannis' }
      ]
    };

    return from(
      this.apiService.CreateSession({
        title: realtimeSession.id,
        pincode: realtimeSession.pincode,
        whiteboard: JSON.stringify(realtimeSession.whiteboard)
      })
    ).pipe(
      map(sessionResponse => {
        /*
        realtimeSession.players.forEach(player => {
          this.apiService
            .CreatePlayer({
              sessionID: sessionResponse.id,
              fullName: player.fullName
            })
            .catch(err => console.log(err));
        });
        */
        return new RealtimeSession(sessionResponse);
      })
    );

    // create session
    this.apiService
      .CreateSession({
        title: realtimeSession.id,
        pincode: realtimeSession.pincode,
        whiteboard: JSON.stringify(realtimeSession.whiteboard)
      })
      .then(session => {
        // add players to session
        realtimeSession.players.forEach(player => {
          this.apiService.CreatePlayer({
            sessionID: session.id,
            fullName: player.fullName
          });
        });
      })
      .catch(err => console.log(err));
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

  // fetches session each time someone calls updateSession, sets behaviorSubject
  subscribeOnSessionUpdates() {
    this.apiService.OnUpdateSessionListener.subscribe((evt: any) => {
      this.setCurrentRealtimeSession(
        new RealtimeSession(evt.value.data.onUpdateSession)
      );
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
