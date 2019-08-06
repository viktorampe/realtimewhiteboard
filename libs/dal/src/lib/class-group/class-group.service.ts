import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassGroupInterface } from '../+models';
import { ClassGroupServiceInterface } from './class-group.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassGroupService implements ClassGroupServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<ClassGroupInterface[]> {
    return this.personApi
      .getData(userId, 'classGroups')
      .pipe(
        map((res: { classGroups: ClassGroupInterface[] }) => res.classGroups)
      );
  }
}
