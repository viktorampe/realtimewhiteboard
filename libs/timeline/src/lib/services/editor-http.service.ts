import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mapTo, retry, tap } from 'rxjs/operators';
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
  public apiBase: string;
  public eduContentMetadataId: number;
  private eduContentId: number;

  constructor(private http: HttpClient) {}

  public getJson(): Observable<TimelineConfigInterface> {
    const response$ = this.http
      .get<{ timeline: string; eduContentId: number }>(
        this.apiBase +
          '/api/eduContentMetadata/' +
          this.eduContentMetadataId +
          '?filter={"fields":["timeline","eduContentId"]}',
        { withCredentials: true }
      )
      .pipe(
        retry(RETRY_AMOUNT),
        catchError(this.handleError),
        tap(response => (this.eduContentId = response.eduContentId)),
        map(
          (response): TimelineConfigInterface => JSON.parse(response.timeline)
        )
      );

    return response$;
  }

  public setJson(timelineConfig: TimelineConfigInterface): Observable<boolean> {
    const response$ = this.http
      .put(
        this.apiBase + '/api/eduContentMetadata/' + this.eduContentMetadataId,
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
    return (
      this.apiBase +
      '/api/eduContents/' +
      this.eduContentId +
      '/redirectURL/' + // TODO: doublecheck once API is finalised
      this.eduContentMetadataId
    );
  }

  public uploadFile(file: File): Observable<StorageInfoInterface> {
    // expects multiple='multiple' to be set on the file input

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const response$ = this.http
      .post(
        this.apiBase + '/api/EduContentFiles/' + this.eduContentId + '/store',
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
