import { Injectable } from '@angular/core';
import {
  ContentStatusApi,
  PersonApi,
  StudentContentStatusApi
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { ContentStatusInterface } from '../+models';
import { StudentContentStatusInterface } from '../+models/StudentContentStatus.interface';
import { StudentContentStatusServiceInterface } from './student-content-status.service.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentContentStatusService
  implements StudentContentStatusServiceInterface {
  constructor(
    private studentContentStatusApi: StudentContentStatusApi,
    private personApi: PersonApi,
    private contentStatusApi: ContentStatusApi
  ) {}

  getById(statusId: number): Observable<StudentContentStatusInterface> {
    return this.studentContentStatusApi.findById(statusId);
  }

  getAllByStudentId(
    studentId: number
  ): Observable<StudentContentStatusInterface[]> {
    return this.personApi.getStudentContentStatuses(studentId) as Observable<
      StudentContentStatusInterface[]
    >;
  }

  updateStudentContentStatus(
    studentContentStatus: StudentContentStatusInterface
  ): Observable<StudentContentStatusInterface> {
    return this.studentContentStatusApi.patchAttributes(
      studentContentStatus.id,
      { contentStatusId: studentContentStatus.contentStatusId }
    ) as Observable<StudentContentStatusInterface>;
  }

  addStudentContentStatus(
    studentContentStatus: StudentContentStatusInterface
  ): Observable<StudentContentStatusInterface> {
    return this.personApi.createStudentContentStatuses(
      studentContentStatus.personId,
      studentContentStatus
    ) as Observable<StudentContentStatusInterface>;
  }

  getAllContentStatuses(): Observable<ContentStatusInterface[]> {
    return this.contentStatusApi.find<ContentStatusInterface>();
  }
}
