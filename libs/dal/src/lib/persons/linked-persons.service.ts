import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeacherStudentInterface } from '../+models';

export const LINKED_PERSON_SERVICE_TOKEN = new InjectionToken(
  'LinkedPersonService'
);

export interface LinkedPersonServiceInterface {
  getAllTeacherStudentsForUser(
    userId: number
  ): Observable<TeacherStudentInterface[]>;
  getAllLinkedPersonsForUser(
    userId: number
  ): Observable<TeacherStudentInterface[]>;
}

@Injectable({
  providedIn: 'root'
})
export class LinkedPersonService implements LinkedPersonServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllTeacherStudentsForUser(
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

  getAllLinkedPersonsForUser(
    userId: number
  ): Observable<TeacherStudentInterface[]> {
    return this.getAllTeacherStudentsForUser(userId);

    // TODO create separate linked-user and teacher-student state
    // TODO add linkedPersons to getData()

    // return this.personApi
    //   .getData(userId, 'linkedPersons')
    //   .pipe(
    //     map(
    //       (res: { linkedPersons: TeacherStudentInterface[] }) =>
    //         res.linkedPersons
    //     )
    //   );
  }
}
