import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimelineConfig } from '../interfaces/timeline';
import { EditorHttpServiceInterface } from '../services/editor-http.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EditorViewModel {
  constructor(private editorHttpService: EditorHttpServiceInterface) {}

  getTimeline(eduContentMetadataId: number): Observable<TimelineConfig> {
    return this.editorHttpService.getJson(eduContentMetaDataId);
  }

  updateTimeline(eduContentMetadataId: number, data: TimelineConfig): void {
    // returned true / false
    this.editorHttpService.setJson(eduContentMetadataId, data);
  }

  previewTimeline(eduContentMetadataId: number): Observable<string> {
    return this.editorHttpService.openPreview(eduContentMetadataId);
  }

  uploadFile(eduContentMetadataId: number, file: string): void {
    // true or false
    this.editorHttpService.uploadFile(eduContentMetaDataId, file);
  }
}
