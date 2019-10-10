import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mapTo, retry } from 'rxjs/operators';
import { TimelineConfigInterface } from '../interfaces/timeline';
import {
  EditorHttpServiceInterface,
  StorageInfoInterface
} from './editor-http.service.interface';
import {
  SettingsServiceInterface,
  SETTINGS_SERVICE_TOKEN
} from './settings.service.interface';

export const EDITOR_HTTP_SERVICE_TOKEN = new InjectionToken(
  'EditorHttpService'
);
const RETRY_AMOUNT = 2;

@Injectable({
  providedIn: 'root'
})
export class EditorHttpService implements EditorHttpServiceInterface {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS_SERVICE_TOKEN)
    private settingsService: SettingsServiceInterface
  ) {}

  public getJson(
    eduContentMetadataId: number
  ): Observable<TimelineConfigInterface> {
    const response$ = this.http
      .get<{ timeline: string; eduContentId: number }>(
        this.settingsService.APIBase +
          '/api/eduContentMetadata/' +
          this.settingsService.eduContentMetadataId +
          '?filter={"fields":["timeline","eduContentId"]}',
        { withCredentials: true }
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError),
        map(
          (response): TimelineConfigInterface => {
            this.settingsService.eduContentId = response.eduContentId;
            return JSON.parse(response.timeline);
          }
        )
      );

    return response$;
  }

  public setJson(
    eduContentMetadataId: number,
    timelineConfig: TimelineConfigInterface
  ): Observable<boolean> {
    const response$ = this.http
      .put(
        this.settingsService.APIBase +
          '/api/eduContentMetadata/' +
          this.settingsService.eduContentMetadataId,
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

  public getPreviewUrl(eduContentId, eduContentMetadataId): string {
    return (
      this.settingsService.APIBase +
      '/api/eduContents/' +
      this.settingsService.eduContentId +
      '/redirectURL/' + // TODO: doublecheck once API is finalised
      this.settingsService.eduContentMetadataId
    );
  }

  public uploadFile(
    eduContentMetadataId: number,
    file: File
  ): Observable<StorageInfoInterface> {
    // expects multiple='multiple' to be set on the file input

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const response$ = this.http
      .post(
        this.settingsService.APIBase +
          '/api/EduContentFiles/' +
          this.settingsService.eduContentMetadataId +
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
}
