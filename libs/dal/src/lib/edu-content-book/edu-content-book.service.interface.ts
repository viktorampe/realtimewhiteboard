import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EduContentBookInterface } from '../+models';

export const EDU_CONTENT_BOOK_SERVICE_TOKEN = new InjectionToken(
  'EduContentBookService'
);

// Note: from some reason, most of the EduContentBookMethods are located in the TocService
export interface EduContentBookServiceInterface {
  getAllForUser(userId: number): Observable<EduContentBookInterface[]>;
}
