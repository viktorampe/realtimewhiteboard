import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UnlockedFreePracticeInterface } from '../+models';

export const UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN = new InjectionToken(
  'UnlockedFreePracticeService'
);

export interface UnlockedFreePracticeServiceInterface {
  getAllForUser(userId): Observable<UnlockedFreePracticeInterface[]>;
}
