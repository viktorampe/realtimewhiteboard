import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import {
  catchError,
  delay,
  filter,
  map,
  mapTo,
  retry,
  switchMap,
  take
} from 'rxjs/operators';
import { ModeEnum } from '../../lib/enums/mode.enum';
import WhiteboardInterface from '../../lib/models/whiteboard.interface';

const RETRY_AMOUNT = 2;

export interface WhiteboardHttpServiceInterface {
  getJson(): Observable<WhiteboardInterface>;
  setJson(whiteboard: WhiteboardInterface): Observable<Boolean>;
  uploadFile(file: File): Observable<string>;
}

export interface WhiteboardHttpSettingsInterface {
  apiBase: string;
  metadataId: number;
}

@Injectable({
  providedIn: 'root'
})
export class WhiteboardHttpService implements WhiteboardHttpServiceInterface {
  private apiSettings$ = new BehaviorSubject<WhiteboardHttpSettingsInterface>(
    null
  );
  private _errors$ = new Subject<Error>();

  constructor(private http: HttpClient) {}

  public setSettings(settings: WhiteboardHttpSettingsInterface): void {
    this.apiSettings$.next(settings);
  }

  public getJson(): Observable<WhiteboardInterface> {
    const response$ = this.apiSettings$.pipe(
      filter(settings => !!settings),
      take(1),
      switchMap(settings =>
        this.http.get(settings.apiBase + settings.metadataId)
      ),
      retry(RETRY_AMOUNT),
      // catchError(this.handleError.bind(this)),
      map(
        (response: any): WhiteboardInterface =>
          response
            ? JSON.parse(response)
            : { title: '', cards: [], shelfCards: {} }
      )
    );

    //TODO: return response$;
    return this.apiSettings$.pipe(map(() => this.getWhiteboardMock()));
  }

  public setJson(whiteboard: WhiteboardInterface): Observable<boolean> {
    const apiSettings: WhiteboardHttpSettingsInterface = this.getSettings();

    const response$ = this.http
      .post(
        apiSettings.apiBase + apiSettings.metadataId,
        JSON.stringify(whiteboard)
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError.bind(this)),
        mapTo(true)
      );
    return response$;
  }

  public uploadFile(file: File): Observable<string> {
    const apiSettings: WhiteboardHttpSettingsInterface = this.getSettings();

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const response$ = this.http
      .post(apiSettings.apiBase + apiSettings.metadataId, formData, {
        withCredentials: true
      })
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError.bind(this)),
        map((response: { imageUrl: string }) => response.imageUrl),
        delay(1000)
      );

    return of(
      'https://cdn.babymarkt.com/babymarkt/img/708424/443/steiff-pacco-shiba-inu-29-cm-a270440.jpg'
    ).pipe(delay(1000));
    //TODO: return response$;
  }

  private getWhiteboardMock(): WhiteboardInterface {
    const whiteboard: WhiteboardInterface = {
      title: 'Welcome to the 90s',
      cards: [
        {
          mode: ModeEnum.IDLE,
          viewModeImage: true,
          description: 'Windows 95',
          image:
            'https://cdn01.pijpermedia.nl/RDLrupoRZtt-R7W4iqxYQTyZ9bY=/1290x726/center/middle/https://cdn.pijper.io/source/upcoming/9/950f46fae4_1412162307_13-Redenen-waarom-Windows-95-best-wel-vet-was.jpg',
          color: '#2EA03D',
          top: 56,
          left: 82
        },
        {
          mode: ModeEnum.IDLE,
          viewModeImage: true,
          description: 'Get Ready',
          image:
            'https://vivavlaanderen.radio2.be/images/2665/1100x0/mvp15qbt7vcmjeko_get_ready_1996.jpg',
          color: '#00A7E2',
          top: 296,
          left: 334
        },
        {
          mode: ModeEnum.IDLE,
          viewModeImage: true,
          description: 'Candy',
          image:
            'https://cdn.shopify.com/s/files/1/0736/7879/files/top-10-retro-candies-from-the-1990s-efrutti-gummy-candies-candy-district-sweetest-online-candy-store-canada.png?v=1545772588',
          color: '#00A7E2',
          top: 57,
          left: 515
        },
        {
          mode: ModeEnum.IDLE,
          viewModeImage: true,
          description: 'VRC',
          image:
            'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/stack-of-video-tapes-royalty-free-image-93422307-1563903351.jpg?crop=0.668xw:1.00xh;0.206xw,0&resize=768:*',
          color: '#00A7E2',
          top: 295,
          left: 708
        },
        {
          mode: ModeEnum.IDLE,
          viewModeImage: true,
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
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'Home Alone',
          image:
            'https://vroegert.nl/wp-content/uploads/2016/10/Homealonefeau1.jpg',
          color: '#2EA03D',
          top: 0,
          left: 0
        },
        {
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'NSYNC',
          image:
            'https://www.muzjig.com/wp-content/uploads/2015/08/14383945783922-forgotten-90s-boy-bands-where-are-they-now-1-16708-1364312072-2_big.jpg',
          color: '#2EA03D',
          top: 0,
          left: 0
        },
        {
          mode: ModeEnum.SHELF,
          viewModeImage: true,
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

  private handleError(error: Error) {
    this._errors$.next(error);

    return throwError(error);
  }

  private getSettings(): WhiteboardHttpSettingsInterface {
    const apiSettings: WhiteboardHttpSettingsInterface = this.apiSettings$
      .value;
    if (!apiSettings) {
      throw new Error('no_http_settings_loaded');
    }
    return apiSettings;
  }
}
