import { Injectable } from '@angular/core';
import { EduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { EduContentInterface } from '../+models/EduContent.interface';
import { EducontentServiceInterface } from './edu-content.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduContentService implements EducontentServiceInterface {
  constructor(private educontentApi: EduContentApi) {}

  getAll(): Observable<EduContentInterface[]> {
    return this.educontentApi.find<EduContentInterface>();
  }
}
