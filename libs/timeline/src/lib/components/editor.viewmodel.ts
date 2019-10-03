import { Inject, Injectable } from '@angular/core';
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

  getTimelineConfig() {
    return this.editorHttpService.getJson(1);
  }
}
