import { Injectable } from '@angular/core';
import {
  PersonApi,
  StudentContentStatusApi
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentContentStatusInterface } from '../+models/StudentContentStatus.interface';
import { StudentContentStatusServiceInterface } from './student-content-status.service.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentContentStatusService
  implements StudentContentStatusServiceInterface {
  constructor(
    private studentContentStatusApi: StudentContentStatusApi,
    private personApi: PersonApi
  ) {}

  getById(statusId: number): Observable<StudentContentStatusInterface> {
    return this.studentContentStatusApi.findById(statusId);
  }

  getAllByStudentId(
    studentId: number
  ): Observable<StudentContentStatusInterface[]> {
    return this.personApi.getStudentContentStatuses(studentId);
  }

  updateStudentContentStatus(
    studentContentStatus: StudentContentStatusInterface
  ): Observable<boolean> {
    return this.studentContentStatusApi
      .updateAttributes<StudentContentStatusInterface>(
        { id: studentContentStatus.id },
        { contentStatusId: studentContentStatus.contentStatusId }
      )
      .pipe(map(returnValue => returnValue.id === studentContentStatus.id));
  }
}
