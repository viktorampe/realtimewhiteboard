import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mode } from '../../shared/enums/mode.enum';
import WhiteboardInterface from '../../shared/models/whiteboard.interface';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardHttpService {
  constructor(private http: HttpClient) {}

  public getJson(): Observable<WhiteboardInterface> {
    //TODO: API CALL ==> return this.http.get('https://api.openbrewerydb.org/breweries');
    return of(this.getWhiteboardMock());
  }

  private getWhiteboardMock(): WhiteboardInterface {
    const whiteboard: WhiteboardInterface = {
      defaultColor: '',
      title: 'Whiteboard Mock',
      cards: [
        {
          mode: Mode.IdleMode,
          description: 'First card',
          image: null,
          color: '#2EA03D',
          top: 0,
          left: 0
        },
        {
          mode: Mode.SelectedMode,
          description: 'Grieken en Romeinen',
          image: null,
          color: '#2EA03D',
          top: 0,
          left: 0
        }
      ],
      shelfCards: [
        {
          mode: Mode.ShelfMode,
          description: 'Second card',
          image: null,
          color: '#2EA03D',
          top: 0,
          left: 0
        }
      ]
    };
    return whiteboard;
  }
}
