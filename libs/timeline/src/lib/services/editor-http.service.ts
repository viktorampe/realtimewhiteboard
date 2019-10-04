import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TimelineConfig } from '../interfaces/timeline';
import { EditorHttpServiceInterface } from './editor-http.service.interface';

export const EDITOR_HTTP_SERVICE_TOKEN = new InjectionToken(
  'EditorHttpService'
);

@Injectable({
  providedIn: 'root'
})
export class EditorHttpService implements EditorHttpServiceInterface {
  getJson(eduContentMetadataId: number): Observable<TimelineConfig> {
    throw new Error('Method not implemented.');
  }
  setJson(
    eduContentMetadataId: number,
    timeLineConfig: TimelineConfig
  ): import('rxjs').Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  openPreview(
    eduContentId: number,
    eduContentMetadataId: number
  ): Observable<string> {
    throw new Error('Method not implemented.');
  }
  uploadFile(file: string): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
}
