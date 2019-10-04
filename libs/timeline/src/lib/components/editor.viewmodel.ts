import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimelineConfig } from '../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import { EditorHttpServiceInterface } from '../services/editor-http.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EditorViewModel {
  constructor(
    @Inject(EDITOR_HTTP_SERVICE_TOKEN)
    private editorHttpService: EditorHttpServiceInterface
  ) {}

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
