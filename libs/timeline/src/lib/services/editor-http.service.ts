import { Injectable, InjectionToken } from '@angular/core';
import { EditorHttpServiceInterface } from './editor-http.service.interface';

export const EDITOR_HTTP_SERVICE_TOKEN = new InjectionToken(
  'EditorHttpService'
);

@Injectable({
  provideTimelineConfigInterface
})
export class EditorHttpService implements EditorHttpServiceInterface {
  getJson() {}

  setJson() {}

  openPreview() {}

  uploadFile() {}
}
TimelineConfigInterfaceTimelineConfigInterfaceTimelineConfigInterface;
