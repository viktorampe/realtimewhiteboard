import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonInterface, TeacherStudentInterface } from '../+models';

export const LINKED_PERSON_SERVICE_TOKEN = new InjectionToken(
  'LinkedPersonService'
);

export interface LinkedPersonServiceInterface {
  getAllForUser(userId: number): Observable<PersonInterface[]>;

  getTeacherStudentsForUser(
    userId: number
  ): Observable<TeacherStudentInterface[]>;
}

@Injectable({
  providedIn: 'root'
})
export class LinkedPersonService implements LinkedPersonServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<PersonInterface[]> {
    return this.personApi
      .getData(userId, 'persons')
      .pipe(map((res: { persons: PersonInterface[] }) => res.persons));
  }

  getTeacherStudentsForUser(
    userId: number
  ): Observable<TeacherStudentInterface[]> {
    return this.personApi
      .getData(userId, 'teacherStudents')
      .pipe(
        map(
          (res: { teacherStudents: TeacherStudentInterface[] }) =>
            res.teacherStudents
        )
      );
  }
}
