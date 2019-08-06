import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassGroupInterface } from '../+models';

export const CLASS_GROUP_SERVICE_TOKEN = new InjectionToken(
  'ClassGroupService'
);
export interface ClassGroupServiceInterface {
  getAllForUser(userId: number): Observable<ClassGroupInterface[]>;
}
