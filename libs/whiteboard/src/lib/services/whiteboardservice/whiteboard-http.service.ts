import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError, timer } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mapTo,
  retry,
  switchMap,
  take
} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ModeEnum } from '../../enums/mode.enum';
import ImageInterface from '../../models/image.interface';
import WhiteboardInterface from '../../models/whiteboard.interface';

const RETRY_AMOUNT = 2;

export interface WhiteboardHttpServiceInterface {
  getJson(): Observable<WhiteboardInterface>;
  setJson(whiteboard: WhiteboardInterface): Observable<Boolean>;
  uploadFile(file: File): Observable<ImageInterface>;
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
    return this.apiSettings$.pipe(
      filter(settings => !!settings),
      map(() => this.getWhiteboardMock())
    );
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

  private getEventMessage(event) {
    switch (event.type) {
      case HttpEventType.Sent:
        return { progress: 0 };

      case HttpEventType.UploadProgress:
        return { progress: Math.round((100 * event.loaded) / event.total) };

      case HttpEventType.Response:
        return { imageUrl: event.imageUrl };
    }
  }

  public uploadFile(file: File): Observable<ImageInterface> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const request = new HttpRequest('POST', '/upload/file', file, {
      reportProgress: true
    });

    const request$ = this.http.request(request);
    request$.pipe(
      retry(RETRY_AMOUNT),
      catchError(this.handleError.bind(this)),
      map(event => this.getEventMessage(event))
    );

    return timer(0, 10).pipe(
      take(101),
      map(progress => {
        if (progress === 100) {
          return {
            imageUrl:
              'https://cdn.iconscout.com/icon/free/png-512/css-118-569410.png'
          };
        }
        return { progress: progress };
      })
    );
  }

  private getWhiteboardMock(): WhiteboardInterface {
    const whiteboard: WhiteboardInterface = {
      title: 'Welcome to the 90s',
      cards: [],
      shelfCards: [
        {
          id: uuidv4(),
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'Windows 95',
          image: {
            imageUrl:
              'https://cdn01.pijpermedia.nl/RDLrupoRZtt-R7W4iqxYQTyZ9bY=/1290x726/center/middle/https://cdn.pijper.io/source/upcoming/9/950f46fae4_1412162307_13-Redenen-waarom-Windows-95-best-wel-vet-was.jpg'
          },
          color: '#2EA03D',
          top: 56,
          left: 82
        },
        {
          id: uuidv4(),
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'Get Ready',
          image: {
            imageUrl:
              'https://vivavlaanderen.radio2.be/images/2665/1100x0/mvp15qbt7vcmjeko_get_ready_1996.jpg'
          },
          color: '#00A7E2',
          top: 296,
          left: 334
        },
        {
          id: uuidv4(),
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'Candy',
          image: {
            imageUrl:
              'https://cdn.shopify.com/s/files/1/0736/7879/files/top-10-retro-candies-from-the-1990s-efrutti-gummy-candies-candy-district-sweetest-online-candy-store-canada.png?v=1545772588'
          },
          color: '#00A7E2',
          top: 57,
          left: 515
        },
        {
          id: uuidv4(),
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'VRC',
          image: {
            imageUrl:
              'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/stack-of-video-tapes-royalty-free-image-93422307-1563903351.jpg?crop=0.668xw:1.00xh;0.206xw,0&resize=768:*'
          },
          color: '#00A7E2',
          top: 295,
          left: 708
        },
        {
          id: uuidv4(),
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'Gameboy',
          image: {
            imageUrl:
              'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nintendo-game-boy-handheld-video-game-console-taken-on-july-news-photo-1065385418-1563905496.jpg?crop=0.79806xw:1xh;center,top&resize=768:*'
          },
          color: '#00A7E2',
          top: 63,
          left: 918
        },
        {
          id: uuidv4(),
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'Home Alone',
          image: {
            imageUrl:
              'https://vroegert.nl/wp-content/uploads/2016/10/Homealonefeau1.jpg'
          },
          color: '#2EA03D',
          top: 0,
          left: 0
        },
        {
          id: uuidv4(),
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'NSYNC',
          image: {
            imageUrl:
              'https://www.muzjig.com/wp-content/uploads/2015/08/14383945783922-forgotten-90s-boy-bands-where-are-they-now-1-16708-1364312072-2_big.jpg'
          },
          color: '#2EA03D',
          top: 0,
          left: 0
        },
        {
          id: uuidv4(),
          mode: ModeEnum.SHELF,
          viewModeImage: true,
          description: 'Capri Sun',
          image: {
            imageUrl:
              'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/boxes-of-capri-sun-juice-sit-on-shelves-at-a-grocery-store-news-photo-526195522-1563903441.jpg?crop=0.668xw:1.00xh;0.0204xw,0&resize=768:*'
          },
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
