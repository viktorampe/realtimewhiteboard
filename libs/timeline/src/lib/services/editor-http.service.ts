import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimelineConfig } from '../interfaces/timeline';
import { ENVIRONMENT_API_TOKEN } from './../../../../shared/src/lib/interfaces/environment.injectiontokens';
import { EnvironmentApiInterface } from './../../../../shared/src/lib/interfaces/environment.interfaces';
import { EditorHttpServiceInterface } from './editor-http.service.interface';

export const EDITOR_HTTP_SERVICE_TOKEN = new InjectionToken(
  'EditorHttpService'
);

@Injectable({
  providedIn: 'root'
})
export class EditorHttpService implements EditorHttpServiceInterface {
  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT_API_TOKEN)
    private environmentApi: EnvironmentApiInterface
  ) {}

  public getJson(eduContentMetadataId: number): Observable<TimelineConfig> {
    const response$ = this.http.get(
      this.environmentApi + '/api/eduContentMetaData/' + eduContentMetadataId
      // +
      // '/timeline'
    );

    const timelineConfig$: Observable<TimelineConfig> = response$.pipe(
      map(response => this.convertGetJsonReponseToTimelineConfig(response))
    );

    timelineConfig$.subscribe(response => console.log(response));

    return timelineConfig$;
  }

  public setJson(
    eduContentMetadataId: number,
    timeLineConfig: TimelineConfig
  ): Observable<boolean> {
    return;
  }

  public openPreview(): Observable<string> {
    return;
  }

  public uploadFile(file: string): Observable<boolean> {
    return;
  }

  private convertGetJsonReponseToTimelineConfig(response) {
    console.log(
      'log: EditorHttpService -> convertGetJsonReponseToTimelineConfig -> response',
      response
    );

    return {} as TimelineConfig;
  }
}
