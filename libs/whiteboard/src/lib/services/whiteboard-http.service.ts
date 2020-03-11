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
import { ModeEnum } from '../../lib/enums/mode.enum';
import WhiteboardInterface from '../../lib/models/whiteboard.interface';
import CardInterface from '../models/card.interface';
import ImageInterface from '../models/image.interface';

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
        this.http.get(
          settings.apiBase + '/api/eduContentMetadata/' + settings.metadataId,
          { withCredentials: true }
        )
      ),
      retry(RETRY_AMOUNT),
      catchError(this.handleError.bind(this)),
      map(
        (response: any): WhiteboardInterface =>
          response
            ? JSON.parse(response.data)
            : { title: '', cards: [], shelfCards: {} }
      ),
      map(
        (whiteboard: any): WhiteboardInterface => ({
          title: whiteboard.title,
          cards: [],
          shelfCards: whiteboard.cards.map(
            (c: any): CardInterface => ({
              id: uuidv4(),
              image: c.image ? { imageUrl: c.image } : {},
              viewModeImage: !!c.image,
              top: 0,
              left: 0,
              description: c.description,
              mode: ModeEnum.SHELF,
              color: c.color
            })
          )
        })
      )
    );

    return response$;
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
