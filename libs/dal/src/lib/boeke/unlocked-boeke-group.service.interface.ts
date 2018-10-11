import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UnlockedBoekeGroupInterface } from '../+models';

export const UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN = new InjectionToken(
  'UnlockedBoekeGroupService'
);
export interface UnlockedBoekeGroupServiceInterface {
  getAllForUser(userId: number): Observable<UnlockedBoekeGroupInterface[]>;
}
