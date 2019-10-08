import { Observable } from 'rxjs';
import { TimelineConfigInterface } from '../interfaces/timeline';
export interface EditorHttpServiceInterface {
  getJson(eduContentMetadataId: number): Observable<TimelineConfigInterface>;
  setJson(
    eduContentMetadataId: number,
    timelineConfig: TimelineConfigInterface
  ): Observable<boolean>;
  getPreviewUrl(eduContentId, eduContentMetadataId): string;
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
