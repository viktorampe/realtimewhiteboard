import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const CONTENTREQUEST_SERVICE_TOKEN = new InjectionToken(
  'ContentRequestService'
);

export interface ContentRequestServiceInterface {
  requestUrl(contentId: number): Observable<string>;
}
