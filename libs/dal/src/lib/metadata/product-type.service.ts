import { Injectable } from '@angular/core';
import { EduContentProductTypeApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { EduContentProductTypeInterface } from '../+models';
import { ProductTypeServiceInterface } from './product-type.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService implements ProductTypeServiceInterface {
  constructor(private eduContentProductTypeApi: EduContentProductTypeApi) {}

  getAll(): Observable<EduContentProductTypeInterface[]> {
    return this.eduContentProductTypeApi.find<EduContentProductTypeInterface>();
  }
}
