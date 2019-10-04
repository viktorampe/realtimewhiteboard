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
    return this.editorHttpService.getJson(eduContentMetadataId);
  }

  updateTimeline(eduContentMetadataId: number, data: TimelineConfig): void {
    this.editorHttpService.setJson(eduContentMetadataId, data);
  }

  previewTimeline(
    eduContentId: number,
    eduContentMetadataId: number
  ): Observable<string> {
    return this.editorHttpService.openPreview(
      eduContentId,
      eduContentMetadataId
    );
  }

  uploadFile(file: string): void {
    this.editorHttpService.uploadFile(file);
  }
}
