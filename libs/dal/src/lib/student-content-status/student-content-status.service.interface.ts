import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentContentStatusInterface } from '../+models/StudentContentStatus.interface';

export const STUDENT_CONTENT_STATUS_SERVICE_TOKEN = new InjectionToken(
  'StudentContentStatusService'
);
export interface StudentContentStatusServiceInterface {
  getById(statusId: number): Observable<StudentContentStatusInterface>;
  getAllByStudentId(
    studentId: number
  ): Observable<StudentContentStatusInterface[]>;
  updateStudentContentStatus(
    studentContentStatus: StudentContentStatusInterface
  );
}
