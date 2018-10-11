import { inject, TestBed } from '@angular/core/testing';
import { StudentContentStatusApi } from '@diekeure/polpo-api-angular-sdk';
import { StudentContentStatusService } from './student-content-status.service';

export class MockStudentContentStatusApi {}

describe('StudentContentStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentContentStatusService,
        {
          provide: StudentContentStatusApi,
          useClass: MockStudentContentStatusApi
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
