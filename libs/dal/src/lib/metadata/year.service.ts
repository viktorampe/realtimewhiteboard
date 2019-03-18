import { Injectable } from '@angular/core';
import { YearApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { YearInterface } from '../+models';
import { YearServiceInterface } from './year.service.interface';

@Injectable({
  providedIn: 'root'
})
export class YearService implements YearServiceInterface {
  constructor(private yearApi: YearApi) {}

  getAll(): Observable<YearInterface[]> {
    return this.yearApi.find<YearInterface>();
  }
}
