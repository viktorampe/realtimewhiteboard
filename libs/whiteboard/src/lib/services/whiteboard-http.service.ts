import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mapTo,
  retry,
  shareReplay,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { ColorInterface } from '../models/color.interface';
import ImageInterface from '../models/image.interface';
import { WhiteboardInterface } from '../models/whiteboard.interface';

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
  private eduContentId: number;
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
          settings.apiBase + '/eduContentMetadata/' + settings.metadataId,
          { withCredentials: true }
        )
      ),
      retry(RETRY_AMOUNT),
      catchError(this.handleError.bind(this)),
      tap(response => (this.eduContentId = response.eduContentId)),
      map(
        (response: any): WhiteboardInterface =>
          response.data
            ? JSON.parse(response.data)
            : { title: '', cards: [], shelfCards: [] }
      ),
      shareReplay(1)
    );

    return response$;
  }

  public setJson(whiteboard: WhiteboardInterface): Observable<boolean> {
    const apiSettings: WhiteboardHttpSettingsInterface = this.getSettings();

    const response$ = this.http
      .patch(
        apiSettings.apiBase + '/eduContentMetadata/' + apiSettings.metadataId,
        { data: JSON.stringify(whiteboard) },
        { withCredentials: true }
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError.bind(this)),
        mapTo(true)
      );

    return response$;
  }

  public getColors(): Observable<{ [key: string]: ColorInterface[] }> {
    return this.apiSettings$.pipe(
      filter(settings => !!settings),
      take(1),
      switchMap(settings =>
        this.http.get<{ [key: string]: ColorInterface[] }>(
          settings.apiBase + '/whiteboard/colors'
        )
      ),
      retry(RETRY_AMOUNT),
      catchError(this.handleError.bind(this)),
      map((response: { [key: string]: ColorInterface[] }) => response),
      shareReplay(1)
    );
  }

  private getEventMessage(event) {
    switch (event.type) {
      case HttpEventType.Sent:
        return { progress: 0 };

      case HttpEventType.UploadProgress:
        return { progress: Math.round((100 * event.loaded) / event.total) };

      case HttpEventType.Response:
        const apiSettings: WhiteboardHttpSettingsInterface = this.getSettings();
        return {
          imageUrl:
            apiSettings.apiBase +
            '/EduFiles/' +
            event.body.storageInfo.eduFileId +
            '/redirectUrl'
        };

      default:
        return {};
    }
  }

  public uploadFile(file: File): Observable<ImageInterface> {
    const apiSettings: WhiteboardHttpSettingsInterface = this.getSettings();

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const request = new HttpRequest(
      'POST',
      apiSettings.apiBase + '/EduContentFiles/' + this.eduContentId + '/store',
      formData,
      {
        reportProgress: true,
        withCredentials: true
      }
    );

    const request$ = this.http.request(request);
    return request$.pipe(
      retry(RETRY_AMOUNT),
      catchError(this.handleError.bind(this)),
      filter(event => !!event),
      map(event => this.getEventMessage(event)),
      filter(response => !!response.imageUrl || !!response.progress)
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
