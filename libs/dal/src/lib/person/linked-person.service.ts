import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonInterface, TeacherStudentInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class LinkedPersonService {
  constructor(private personApi: PersonApi) {}

  getPersons(userId: number): Observable<PersonInterface[]> {
    return this.personApi
      .getData(userId, 'persons')
      .pipe(map((result: { persons: PersonInterface[] }) => result.persons));
  }

  getTeacherStudents(userId: number): Observable<TeacherStudentInterface[]> {
    return this.personApi
      .getData(userId, 'teacherStudents')
      .pipe(
        map(
          (result: { teacherStudents: TeacherStudentInterface[] }) =>
            result.teacherStudents
        )
      );
  }
}
