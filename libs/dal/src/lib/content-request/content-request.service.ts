import { Injectable } from '@angular/core';
import { EduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentRequestServiceInterface } from './content-request.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentRequestService implements ContentRequestServiceInterface {
  constructor(private educontentApi: EduContentApi) {}

  requestUrl(contentId: number): Observable<string> {
    return this.educontentApi.requestURLRemote(contentId, false).pipe(
      map(url => {
        return (url as any).url;
      })
    );
  }
}
