import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { Subject } from 'rxjs';
import { ScormApi } from './scorm-api';
import { ScormCmiInterface, ScormCMIMode } from './scorm-api.interface';
import { ScormApiServiceInterface } from './scorm-api.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormApiService implements ScormApiServiceInterface {
  commit$ = new Subject<ScormCmiInterface>();

  cmi$ = new Subject<ScormCmiInterface>();

  constructor(@Inject(WINDOW) private window: Window) {}

  init(cmi: ScormCmiInterface, mode: ScormCMIMode) {
    if (!this.window['API']) {
      const API = new ScormApi(cmi, mode);

      API.commit$.subscribe(val => {
        this.commit$.next(val);
      });
      API.cmi$.subscribe(val => this.cmi$.next(val));

      this.window['API'] = API;
    }
  }
}
