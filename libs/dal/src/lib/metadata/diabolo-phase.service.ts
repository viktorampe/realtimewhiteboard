import { Injectable } from '@angular/core';
import { DiaboloPhaseApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { DiaboloPhaseInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class DiaboloPhaseService {
  constructor(private diaboloPhaseApi: DiaboloPhaseApi) {}

  getAll(): Observable<DiaboloPhaseInterface[]> {
    return this.diaboloPhaseApi.find<DiaboloPhaseInterface>();
  }
}
