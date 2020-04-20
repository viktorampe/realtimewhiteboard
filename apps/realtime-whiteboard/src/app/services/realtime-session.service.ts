import { Injectable } from '@angular/core';
import ImageInterface from 'libs/whiteboard/src/lib/models/image.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIService } from '../API.service';
import RealtimeSession from '../models/realtimesession';

export interface whiteboardDataServiceInterface {
  getWhiteboardData(): Observable<WhiteboardInterface>;
  updateWhiteboardData(whiteboard: WhiteboardInterface): Observable<Boolean>;
  uploadFile(file: File): Observable<ImageInterface>;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeSessionService implements whiteboardDataServiceInterface {
  constructor(private apiService: APIService) {}

  getSession(sessionId: string): Observable<RealtimeSession> {
    return from(this.apiService.GetSession(sessionId)).pipe(
      map((response: any) => {
        return new RealtimeSession(response);
      })
    );
  }

  getWhiteboardData(): Observable<WhiteboardInterface> {
    throw new Error('Method not implemented.');
  }
  updateWhiteboardData(whiteboard: WhiteboardInterface): Observable<Boolean> {
    throw new Error('Method not implemented.');
  }
  uploadFile(file: File): Observable<ImageInterface> {
    throw new Error('Method not implemented.');
  }
}
