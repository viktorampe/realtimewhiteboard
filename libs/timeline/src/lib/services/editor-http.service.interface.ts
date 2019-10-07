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
  uploadFile(
    eduContentId: number,
    file: File
  ): Observable<StorageInfoInterface>;
}

export interface StorageInfoInterface {
  checksum?: string;
  name: string;
  storageName: string;
}
