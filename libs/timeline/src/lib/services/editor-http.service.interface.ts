import { Observable } from 'rxjs';
import { TimelineConfigInterface } from '../interfaces/timeline';
export interface EditorHttpServiceInterface {
  setSettings(settings: EditorHttpSettingsInterface): void;
  getJson(): Observable<TimelineConfigInterface>;
  setJson(timelineConfig: TimelineConfigInterface): Observable<boolean>;
  getPreviewUrl(): string;
  uploadFile(file: File): Observable<StorageInfoInterface>;
}

export interface StorageInfoInterface {
  checksum?: string;
  name: string;
  storageName: string;
}

export interface EditorHttpSettingsInterface {
  apiBase: string;
  eduContentMetadataId: number;
}
