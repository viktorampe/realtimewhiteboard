import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UserContentInterface } from '../+models';

export const USER_CONTENT_SERVICE_TOKEN = new InjectionToken('UserContentService');
export interface UserContentServiceInterface {
  getAllForUser(userId: number): Observable<UserContentInterface[]>;
}
