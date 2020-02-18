import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mode } from '../../shared/enums/mode.enum';
import WhiteboardInterface from '../../shared/models/whiteboard.interface';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardHttpService {
  private url = 'www.apicallmock.be';

  constructor(private http: HttpClient) {}

  public getJson(): Observable<WhiteboardInterface> {
    //TODO: API CALL ==> return this.http.get('https://api.openbrewerydb.org/breweries');
    return of(this.getWhiteboardMock());
  }

  public setJson(whiteboard: WhiteboardInterface) {
    const response = this.http.post(this.url, JSON.stringify(whiteboard));
  }

  private getWhiteboardMock(): WhiteboardInterface {
    const whiteboard: WhiteboardInterface = {
      title: 'Welcome to the 90s',
      cards: [
        {
          mode: Mode.IdleMode,
          description: 'Windows 95',
          image:
            'https://cdn01.pijpermedia.nl/RDLrupoRZtt-R7W4iqxYQTyZ9bY=/1290x726/center/middle/https://cdn.pijper.io/source/upcoming/9/950f46fae4_1412162307_13-Redenen-waarom-Windows-95-best-wel-vet-was.jpg',
          color: '#2EA03D',
          top: 56,
          left: 82
        },
        {
          mode: Mode.IdleMode,
          description: 'Get Ready',
          image:
            'https://vivavlaanderen.radio2.be/images/2665/1100x0/mvp15qbt7vcmjeko_get_ready_1996.jpg',
          color: '#00A7E2',
          top: 296,
          left: 334
        },
        {
          mode: Mode.IdleMode,
          description: 'Candy',
          image:
            'https://cdn.shopify.com/s/files/1/0736/7879/files/top-10-retro-candies-from-the-1990s-efrutti-gummy-candies-candy-district-sweetest-online-candy-store-canada.png?v=1545772588',
          color: '#00A7E2',
          top: 57,
          left: 515
        },
        {
          mode: Mode.IdleMode,
          description: 'VRC',
          image:
            'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/stack-of-video-tapes-royalty-free-image-93422307-1563903351.jpg?crop=0.668xw:1.00xh;0.206xw,0&resize=768:*',
          color: '#00A7E2',
          top: 295,
          left: 708
        },
        {
          mode: Mode.IdleMode,
          description: 'Gameboy',
          image:
            'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nintendo-game-boy-handheld-video-game-console-taken-on-july-news-photo-1065385418-1563905496.jpg?crop=0.79806xw:1xh;center,top&resize=768:*',
          color: '#00A7E2',
          top: 63,
          left: 918
        }
      ],
      shelfCards: [
        {
          mode: Mode.ShelfMode,
          description: 'Home Alone',
          image:
            'https://vroegert.nl/wp-content/uploads/2016/10/Homealonefeau1.jpg',
          color: '#2EA03D',
          top: 0,
          left: 0
        },
        {
          mode: Mode.ShelfMode,
          description: 'NSYNC',
          image:
            'https://www.muzjig.com/wp-content/uploads/2015/08/14383945783922-forgotten-90s-boy-bands-where-are-they-now-1-16708-1364312072-2_big.jpg',
          color: '#2EA03D',
          top: 0,
          left: 0
        },
        {
          mode: Mode.ShelfMode,
          description: 'Capri Sun',
          image:
            'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/boxes-of-capri-sun-juice-sit-on-shelves-at-a-grocery-store-news-photo-526195522-1563903441.jpg?crop=0.668xw:1.00xh;0.0204xw,0&resize=768:*',
          color: '#2EA03D',
          top: 0,
          left: 0
        }
      ]
    };
    return whiteboard;
  }
}
