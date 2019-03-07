import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EduContentProductTypeInterface } from '../+models';

export const PRODUCT_TYPE_SERVICE_TOKEN = new InjectionToken(
  'ProductTypeService'
);

export interface ProductTypeServiceInterface {
  getAll(): Observable<EduContentProductTypeInterface[]>;
}
