import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolTypeInterface } from './../+models/SchoolType.interface';

export const SCHOOL_TYPE_SERVICE_TOKEN = new InjectionToken(
  'SchoolTypeService'
);

export interface SchoolTypeServiceInterface {
  getAll(): Observable<SchoolTypeInterface[]>;
}
