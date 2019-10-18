import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mapTo,
  retry,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { TimelineConfigInterface } from '../interfaces/timeline';
import {
  EditorHttpServiceInterface,
  EditorHttpSettingsInterface,
  StorageInfoInterface
} from './editor-http.service.interface';

export const EDITOR_HTTP_SERVICE_TOKEN = new InjectionToken(
  'EditorHttpService'
);
const RETRY_AMOUNT = 2;

@Injectable({
  providedIn: 'root'
})
export class EditorHttpService implements EditorHttpServiceInterface {
  public errors$: Observable<Error>;

  private apiSettings$ = new BehaviorSubject<EditorHttpSettingsInterface>(null);
  private eduContentId: number;
  private _errors$ = new Subject<Error>();

  constructor(private http: HttpClient) {
    this.errors$ = this._errors$.asObservable();
  }

  public setSettings(settings: EditorHttpSettingsInterface): void {
    this.apiSettings$.next(settings);
  }

  public getJson(): Observable<TimelineConfigInterface> {
    const response$ = this.apiSettings$.pipe(
      filter(settings => !!settings),
      take(1),
      switchMap(settings =>
        this.http.get<{ timeline: string; eduContentId: number }>(
          settings.apiBase +
            '/eduContentMetadata/' +
            settings.eduContentMetadataId +
            '?filter={"fields":["timeline","eduContentId"]}',
          { withCredentials: true }
        )
      ),
      retry(RETRY_AMOUNT),
      catchError(this.handleError.bind(this)),
      tap(response => (this.eduContentId = response.eduContentId)),
      map((response): TimelineConfigInterface => JSON.parse(response.timeline))
    );

    return response$;
  }

  public setJson(timelineConfig: TimelineConfigInterface): Observable<boolean> {
    const apiSettings: EditorHttpSettingsInterface = this.getSettings();

    const response$ = this.http
      .patch(
        apiSettings.apiBase +
          '/eduContentMetadata/' +
          apiSettings.eduContentMetadataId,
        { timeline: JSON.stringify(timelineConfig) },
        { withCredentials: true }
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError.bind(this)),
        mapTo(true)
      );

    return response$;
  }

  public getPreviewUrl(): string {
    const apiSettings: EditorHttpSettingsInterface = this.getSettings(true);
    return (
      apiSettings.apiBase +
      '/eduContents/' +
      this.eduContentId +
      '/redirectURL/' +
      apiSettings.eduContentMetadataId
    );
  }

  public uploadFile(file: File): Observable<StorageInfoInterface> {
    const apiSettings: EditorHttpSettingsInterface = this.getSettings(true);
    // expects multiple='multiple' to be set on the file input

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const response$ = this.http
      .post(
        apiSettings.apiBase +
          '/EduContentFiles/' +
          this.eduContentId +
          '/store',
        formData,
        { withCredentials: true }
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError.bind(this)),
        map(
          (response: { storageInfo: StorageInfoInterface }) =>
            response.storageInfo
        )
      );

    return response$;
  }

  private handleError(error: Error) {
    this._errors$.next(error);

    return throwError(error);
  }

  private getSettings(
    eduContentIdRequired?: boolean
  ): EditorHttpSettingsInterface {
    const apiSettings: EditorHttpSettingsInterface = this.apiSettings$.value;
    if (!apiSettings || (eduContentIdRequired && !this.eduContentId)) {
      throw new Error('no_http_settings_loaded');
    }
    return apiSettings;
  }
}
