import { inject, TestBed } from '@angular/core/testing';
import {
  PersonApi,
  StudentContentStatusApi
} from '@diekeure/polpo-api-angular-sdk';
import { StudentContentStatusService } from './student-content-status.service';

export class MockStudentContentStatusApi {}
export class MockPersonApi {}

describe('StudentContentStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentContentStatusService,
        {
          provide: StudentContentStatusApi,
          useClass: MockStudentContentStatusApi
        },
        {
          provide: PersonApi,
          useClass: MockPersonApi
        }
      ]
    });
  });

  it('should be created', inject(
    [StudentContentStatusService],
    (service: StudentContentStatusService) => {
      expect(service).toBeTruthy();
    }
  ));
});
