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
  commit$: Subject<ScormCmiInterface>;

  cmi$: Subject<ScormCmiInterface>;

  constructor(@Inject(WINDOW) private window: Window) {}

  init(cmi: ScormCmiInterface, mode: ScormCmiMode) {
    if (!this.window['API']) {
      const API = new ScormApi(cmi, mode);

      this.commit$ = API.commit$;
      this.cmi$ = API.cmi$;

      this.window['API'] = API;
    }
  }
}
