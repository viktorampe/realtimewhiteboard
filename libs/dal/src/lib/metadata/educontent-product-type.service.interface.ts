import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EduContentProductTypeInterface } from '../+models';

export const EDUCONTENT_PRODUCT_TYPE_SERVICE_TOKEN = new InjectionToken(
  'EduContentProductTypeService'
);

export interface EduContentProductTypeServiceInterface {
  getAll(): Observable<EduContentProductTypeInterface[]>;
}
