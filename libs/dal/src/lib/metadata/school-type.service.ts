import { Injectable } from '@angular/core';
import { SchoolTypeApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { SchoolTypeInterface } from '../+models';
import { SchoolTypeServiceInterface } from './school-type.service.interface';

@Injectable({
  providedIn: 'root'
})
export class SchoolTypeService implements SchoolTypeServiceInterface {
  constructor(private schoolTypeApi: SchoolTypeApi) {}

  getAll(): Observable<SchoolTypeInterface[]> {
    return this.schoolTypeApi.find<SchoolTypeInterface>();
  }
}
