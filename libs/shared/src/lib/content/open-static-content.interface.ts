import { InjectionToken } from '@angular/core';

export const OPEN_STATIC_CONTENT_SERVICE_TOKEN = new InjectionToken<
  OpenStaticContentServiceInterface
>('OpenStaticContentService');

export interface OpenStaticContentServiceInterface {
  open(contentId: number): void;
}
