import { Injectable } from '@angular/core';
import { StudentContentStatusApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { StudentContentStatusInterface } from '../+models/StudentContentStatus.interface';
import { StudentContentStatusServiceInterface } from './student-content-status.service.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentContentStatusService
  implements StudentContentStatusServiceInterface {
  constructor(private studentContentStatusApi: StudentContentStatusApi) {}

  getAll(): Observable<StudentContentStatusInterface[]> {
    return this.studentContentStatusApi.find<StudentContentStatusInterface>({});
  }
}
