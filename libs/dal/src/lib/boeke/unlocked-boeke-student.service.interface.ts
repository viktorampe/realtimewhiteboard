import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UnlockedBoekeStudentInterface } from '../+models';

export const UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN = new InjectionToken(
  'UnlockedBoekeStudentService'
);
export interface UnlockedBoekeStudentServiceInterface {
  getAllForUser(userId: number): Observable<UnlockedBoekeStudentInterface[]>;
}
