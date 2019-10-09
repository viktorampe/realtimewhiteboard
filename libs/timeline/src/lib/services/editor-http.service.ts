import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
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
    @Inject(ENVIRONMENT_API_TOKEN)
    private environmentApi: EnvironmentApiInterface
  ) {}

  public getJson(
    eduContentMetadataId: number
  ): Observable<TimelineConfigInterface> {
    const response$ = this.http
      .get<{ timeline: string }>(
        this.environmentApi.APIBase +
          '/api/eduContentMetadata/' +
          eduContentMetadataId +
          '?filter[fields]=timeline' +
          '&access_token=2' // TODO: remove this bit
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError),
        map(
          response => JSON.parse(response.timeline) as TimelineConfigInterface
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
        this.environmentApi.APIBase +
          '/api/eduContentMetadata/' +
          eduContentMetadataId +
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
      this.environmentApi.APIBase +
      '/api/eduContents/' +
      eduContentId +
      '/redirectURL/' + // TODO: doublecheck once API is finalised
      eduContentMetadataId +
      '?access_token=2' // TODO: remove this bit
    );
  }

  public uploadFile(
    eduContentId: number,
    file: File
  ): Observable<StorageInfoInterface> {
    // expects multiple='multiple' to be set on the file input

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const response$ = this.http
      .post(
        this.environmentApi.APIBase +
          '/api/EduContentFiles/' +
          eduContentId +
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
