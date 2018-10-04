import { Injectable } from '@angular/core';
import { EduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, of } from 'rxjs';
import { EduContentInterface } from '../+models/EduContent.interface';
import { EducontentServiceInterface } from './edu-content.service.interface';

const DUMMY_DATA: EduContentInterface[] = [
  { type: 'boeke', id: 1 },
  { type: 'file', id: 1 }
];

@Injectable({
  providedIn: 'root'
})
export class EduContentService implements EducontentServiceInterface {
  constructor(private educontentApi: EduContentApi) {}

  getAll(): Observable<EduContentInterface[]> {
    return of(DUMMY_DATA);
    // return this.educontentApi.find<EduContentInterface>();
  }
}
