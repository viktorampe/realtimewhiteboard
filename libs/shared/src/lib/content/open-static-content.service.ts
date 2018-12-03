import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { ENVIRONMENT_API_BASE } from '../interfaces';
import { OpenStaticContentServiceInterface } from './open-static-content.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenStaticContentService
  implements OpenStaticContentServiceInterface {
  constructor(
    @Inject(WINDOW) window: Window,
    @Inject(ENVIRONMENT_API_BASE) private apiBase: string
  ) {}

  open(contentId: number): void {
    const url = `${this.apiBase}/api/eduContents/${contentId}/redirectURL`;
    window.open(url);
  }
}
