import { InjectionToken } from '@angular/core';
import { ContentInterface } from '@campus/dal';

export const OPEN_STATIC_CONTENT_SERVICE_TOKEN = new InjectionToken<
  OpenStaticContentServiceInterface
>('OpenStaticContentService');

export interface OpenStaticContentServiceInterface {
  open(content: ContentInterface, stream?: boolean, openDialog?: boolean): void;
}
