import { Observable } from 'rxjs';
import { TimelineConfig } from '../interfaces/timeline';

export interface EditorHttpServiceInterface {
  getJson(eduContentMetadataId: number): Observable<TimelineConfig>;
  setJson(
    eduContentMetadataId: number,
    timeLineConfig: TimelineConfig
  ): Observable<boolean>;
  openPreview(
    eduContentId: number,
    eduContentMetadataId: number
  ): Observable<string>;
  uploadFile(file: string): Observable<boolean>;
}
