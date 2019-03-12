import { Injectable } from '@angular/core';
import { EduContentProductTypeApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { EduContentProductTypeInterface } from '../+models';
import { EduContentProductTypeServiceInterface } from './edu-content-product-type.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduContentProductTypeService
  implements EduContentProductTypeServiceInterface {
  constructor(private eduContentProductTypeApi: EduContentProductTypeApi) {}

  getAll(): Observable<EduContentProductTypeInterface[]> {
    return this.eduContentProductTypeApi.find<EduContentProductTypeInterface>();
  }
}
