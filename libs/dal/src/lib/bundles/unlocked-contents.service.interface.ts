import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UnlockedContentInterface } from '../+models';

export const UNLOCKEDCONTENTS_SERVICE_TOKEN = new InjectionToken(
  'UnlockedContentsService'
);
export interface UnlockedContentsServiceInterface {
  getAllForUser(userId: number): Observable<UnlockedContentInterface[]>;
}
