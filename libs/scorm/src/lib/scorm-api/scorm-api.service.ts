import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ScormApi } from './scorm-api';
import { ScormCmiInterface, ScormCMIMode } from './scorm-api.interface';
import { ScormApiServiceInterface } from './scorm-api.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormApiService implements ScormApiServiceInterface {
  private window = window; //TODO: replace with injected window from window service

  commit$ = new Subject<ScormCmiInterface>();

  cmi$ = new Subject<ScormCmiInterface>();

  constructor() {}

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
