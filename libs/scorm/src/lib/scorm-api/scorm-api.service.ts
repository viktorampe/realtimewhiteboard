import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScormApi } from './scorm-api';
import { CmiInterface, ScormCMIMode } from './scorm-api.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormApiService {
  private window = window; //TODO: replace with injected window from window service

  cmi$: Observable<{
    score: number;
    time: number;
    status: string;
    cmi: CmiInterface;
  }>;

  constructor() {}

  init(mode: ScormCMIMode) {
    const API = new ScormApi(mode);

    this.window['API'] = API;
  }
}
