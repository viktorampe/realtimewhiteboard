import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupInterface } from '../+models';

export const GROUP_SERVICE_TOKEN = new InjectionToken('GroupService');

export interface GroupServiceInterface {
  getAllForUser(userId: number): Observable<GroupInterface[]>;
}
