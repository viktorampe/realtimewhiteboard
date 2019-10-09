import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimelineConfigInterface } from '../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import {
  EditorHttpServiceInterface,
  StorageInfoInterface
} from '../services/editor-http.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EditorViewModel {
  constructor(
    @Inject(EDITOR_HTTP_SERVICE_TOKEN)
    private editorHttpService: EditorHttpServiceInterface
  ) {}

  getTimeline(
    eduContentMetadataId: number
  ): Observable<TimelineConfigInterface> {
    return this.editorHttpService.getJson(eduContentMetadataId);
  }

  updateTimeline(
    eduContentMetadataId: number,
    data: TimelineConfigInterface
  ): Observable<boolean> {
    return this.editorHttpService.setJson(eduContentMetadataId, data);
  }

  previewTimeline(eduContentId: number, eduContentMetadataId: number): string {
    return this.editorHttpService.getPreviewUrl(
      eduContentId,
      eduContentMetadataId
    );
  }

  uploadFile(
    eduContentId: number,
    file: File
  ): Observable<StorageInfoInterface> {
    return this.editorHttpService.uploadFile(eduContentId, file);
  }
}
