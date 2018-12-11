import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { Subject } from 'rxjs';
import { ScormApi } from './scorm-api';
import { ScormCmiInterface, ScormCmiMode } from './scorm-api.interface';
import { ScormApiServiceInterface } from './scorm-api.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormApiService implements ScormApiServiceInterface {
  private API: ScormApi;

  commit$: Subject<ScormCmiInterface>;

  cmi$: Subject<ScormCmiInterface>;

  constructor(@Inject(WINDOW) private window: Window) {}

  init(cmi: ScormCmiInterface, mode: ScormCmiMode) {
    if (!this.window['API'] || !this.API) {
      this.API = new ScormApi(cmi, mode);

      this.commit$ = this.API.commit$;
      this.cmi$ = this.API.cmi$;

      this.window['API'] = this.API;
    } else {
      // set cmi and mode on current API
      this.API.currentResult = cmi;
      this.API.mode = mode;
    }
  }
}
