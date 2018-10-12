import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnlockedBoekeStudentInterface } from '../+models';
import { UnlockedBoekeStudentServiceInterface } from './unlocked-boeke-student.service.interface';

@Injectable({
  providedIn: 'root'
})
export class UnlockedBoekeStudentService
  implements UnlockedBoekeStudentServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<UnlockedBoekeStudentInterface[]> {
    return this.personApi
      .getData(userId, 'unlockedBoekeStudents')
      .pipe(
        map(
          (res: { unlockedBoekeStudents: UnlockedBoekeStudentInterface[] }) =>
            res.unlockedBoekeStudents
        )
      );
  }
}
