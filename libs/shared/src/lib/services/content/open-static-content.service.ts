import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { ContentInterface, EduContent, UserContent } from '@campus/dal';
import {
  EnvironmentApiInterface,
  ENVIRONMENT_API_TOKEN
} from '../../interfaces';
import { OpenStaticContentServiceInterface } from './open-static-content.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenStaticContentService
  implements OpenStaticContentServiceInterface {
  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(ENVIRONMENT_API_TOKEN)
    private environmentApi: EnvironmentApiInterface
  ) {}

  open(content: ContentInterface, stream?: boolean): void {
    if (content instanceof EduContent) {
      const url =
        `${this.environmentApi.APIBase}/api/eduContents/${content.id}/redirectURL` +
        (stream ? '?stream=true' : '');
      this.window.open(url);
    } else if (content instanceof UserContent) {
      this.window.open(content.link);
    }
  }
}
