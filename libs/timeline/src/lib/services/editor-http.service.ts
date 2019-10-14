import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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
  HttpSettingsInterface,
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
  private apiSettings$ = new BehaviorSubject<HttpSettingsInterface>(null);
  private eduContentId: number;

  constructor(private http: HttpClient) {}

  public setSettings(settings: HttpSettingsInterface): void {
    this.apiSettings$.next(settings);
  }

  public getJson(): Observable<TimelineConfigInterface> {
    const response$ = this.apiSettings$.pipe(
      filter(settings => !!settings),
      take(1),
      switchMap(settings =>
        this.http.get<{ timeline: string; eduContentId: number }>(
          settings.apiBase +
            '/api/eduContentMetadata/' +
            settings.eduContentMetadataId +
            '?filter={"fields":["timeline","eduContentId"]}',
          { withCredentials: true }
        )
      ),
      retry(RETRY_AMOUNT),
      catchError(this.handleError),
      tap(response => (this.eduContentId = response.eduContentId)),
      map((response): TimelineConfigInterface => JSON.parse(response.timeline))
    );

    return response$;
  }

  public setJson(timelineConfig: TimelineConfigInterface): Observable<boolean> {
    const apiSettings = this.getSettings();
    const response$ = this.http
      .put(
        apiSettings.apiBase +
          '/api/eduContentMetadata/' +
          apiSettings.eduContentMetadataId,
        { timeline: JSON.stringify(timelineConfig) },
        { withCredentials: true }
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError),
        mapTo(true)
      );

    return response$;
  }

  public getPreviewUrl(): string {
    const apiSettings = this.getSettings(true);
    return (
      apiSettings.apiBase +
      '/api/eduContents/' +
      this.eduContentId +
      '/redirectURL/' +
      apiSettings.eduContentMetadataId
    );
  }

  public uploadFile(file: File): Observable<StorageInfoInterface> {
    const apiSettings = this.getSettings(true);
    // expects multiple='multiple' to be set on the file input

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const response$ = this.http
      .post(
        apiSettings.apiBase +
          '/api/EduContentFiles/' +
          this.eduContentId +
          '/store',
        formData,
        { withCredentials: true }
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError),
        map(response => response as StorageInfoInterface)
      );

    return response$;
  }

  private handleError(error) {
    return throwError(error);
  }

  private getSettings(eduContentIdRequired?: boolean) {
    const apiSettings = this.apiSettings$.value;
    if (!apiSettings || (eduContentIdRequired && !this.eduContentId)) {
      throw new Error('no_http_settings_loaded');
    }
    return apiSettings;
  }
}
