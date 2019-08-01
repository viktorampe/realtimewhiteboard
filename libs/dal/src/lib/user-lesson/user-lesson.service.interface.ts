import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLessonInterface } from '../+models';

export const USER_LESSON_SERVICE_TOKEN = new InjectionToken(
  'UserLessonService'
);

export interface UserLessonServiceInterface {
  getAllForUser(userId): Observable<UserLessonInterface[]>;
}
