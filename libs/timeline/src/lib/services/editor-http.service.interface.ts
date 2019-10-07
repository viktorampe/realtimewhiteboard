import { Observable } from 'rxjs';
import { TimelineConfigInterface } from '../interfaces/timeline';
export interface EditorHttpServiceInterface {
  getJson(eduContentMetadataId: number): Observable<TimelineConfigInterface>;
  setJson(
    eduContentMetadataId: number,
    timelineConfig: TimelineConfigInterface
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
  eduFileId?: string;
}
