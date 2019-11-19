import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MethodLevelInterface } from '../+models';
import { MethodLevelServiceInterface } from './method-level.service.interface';

@Injectable({
  providedIn: 'root'
})
export class MethodLevelService implements MethodLevelServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<MethodLevelInterface[]> {
    return this.personApi
      .getData(userId, 'methodLevels')
      .pipe(
        map((res: { methodLevels: MethodLevelInterface[] }) => res.methodLevels)
      );
  }
}
