import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UnlockedContentInterface } from '../+models';

export const UNLOCKED_CONTENT_SERVICE_TOKEN = new InjectionToken(
  'UnlockedContent'
);

export interface UnlockedContentServiceInterface {
  getAllForUser(userId: number): Observable<UnlockedContentInterface[]>;
}
