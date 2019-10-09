import { HttpClient } from '@angular/common/http';
import { Inject, InjectionToken } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mapTo, retry } from 'rxjs/operators';
import {
  EnvironmentApiInterface,
  ENVIRONMENT_API_TOKEN
} from '../interfaces/environment';
import { TimelineConfigInterface } from '../interfaces/timeline';
import {
  EditorHttpServiceInterface,
  StorageInfoInterface
} from './editor-http.service.interface';
import { SettingsService, SETTINGS_SERVICE_TOKEN } from './settings.service';

export const EDITOR_HTTP_SERVICE_TOKEN = new InjectionToken(
  'EditorHttpService'
);
const RETRY_AMOUNT = 2;

export class EditorHttpService implements EditorHttpServiceInterface {
  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT_API_TOKEN)
    private environmentApi: EnvironmentApiInterface,
    @Inject(SETTINGS_SERVICE_TOKEN)
    private settingsService: SettingsService
  ) {}

  public getJson(
    eduContentMetadataId: number
  ): Observable<TimelineConfigInterface> {
    const response$ = this.http
      .get<{ timeline: string; eduContentId: number }>(
        this.settingsService.APIBase +
          '/api/eduContentMetadata/' +
          this.settingsService.eduContentMetadataId +
          '?filter={"fields": ["timeline", "eduContentId"]}' +
          '&access_token=2' // TODO: remove this bit
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
          this.settingsService.eduContentMetadataId +
          '?access_token=2', // TODO: remove this bit
        { timeline: JSON.stringify(timelineConfig) }
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
      this.settingsService.eduContentMetadataId +
      '?access_token=2' // TODO: remove this bit
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
          '/store' +
          '?access_token=2', // TODO: remove this bit
        formData
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
