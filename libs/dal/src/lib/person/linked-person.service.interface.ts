import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonInterface, TeacherStudentInterface } from '../+models';

export const LINKEDPERSON_SERVICE_TOKEN = new InjectionToken(
  'LinkedPersonService'
);

export interface LinkedPersonServiceInterface {
  getLinkedPersons(userId: number): Observable<PersonInterface[]>;
  getTeacherStudents(userId: number): Observable<TeacherStudentInterface[]>;
}
