import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { ContentInterface, EduContent, UserContent } from '@campus/dal';
import { ENVIRONMENT_API_BASE_TOKEN } from '../interfaces';
import { OpenStaticContentServiceInterface } from './open-static-content.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenStaticContentService
  implements OpenStaticContentServiceInterface {
  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(ENVIRONMENT_API_BASE_TOKEN) private apiBase: string
  ) {}

  open(content: ContentInterface): void {
    if (content instanceof EduContent) {
      const url = `${this.apiBase}/api/eduContents/${content.id}/redirectURL`;
      this.window.open(url);
    } else if (content instanceof UserContent) {
      this.window.open(content.link);
    }
  }
}
