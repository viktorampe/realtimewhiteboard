import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLessonServiceInterface } from '.';
import { UserLessonInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class UserLessonService implements UserLessonServiceInterface {
  getAllForUser(userId): Observable<UserLessonInterface[]> {
    return;
  }
}
