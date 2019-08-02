import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLessonServiceInterface } from '.';
import { UserLessonInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class UserLessonService implements UserLessonServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId): Observable<UserLessonInterface[]> {
    return this.personApi
      .getData(userId, 'userLessons')
      .pipe(
        map((res: { userLessons: UserLessonInterface[] }) => res.userLessons)
      );
  }

  createForUser(
    userId,
    userLesson: UserLessonInterface
  ): Observable<UserLessonInterface> {
    return this.personApi.createUserLessons(userId, userLesson);
  }
}
