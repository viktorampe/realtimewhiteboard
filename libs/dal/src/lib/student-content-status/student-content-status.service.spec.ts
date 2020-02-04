import { inject, TestBed } from '@angular/core/testing';
import {
  ContentStatusApi,
  PersonApi,
  StudentContentStatusApi
} from '@diekeure/polpo-api-angular-sdk';
import { StudentContentStatusFixture } from '../+fixtures';
import { StudentContentStatusService } from './student-content-status.service';

class MockStudentContentStatusApi {
  patchAttributes() {}
}
class MockContentStatusApi {
  find() {}
}
class MockPersonApi {
  createStudentContentStatuses() {}
}

describe('StudentContentStatusService', () => {
  let service: StudentContentStatusService;
  let personApi: PersonApi;
  let contentStatusApi: ContentStatusApi;
  let studentContentStatusApi: StudentContentStatusApi;

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
        },
        {
          provide: ContentStatusApi,
          useClass: MockContentStatusApi
        }
      ]
    });

    service = TestBed.get(StudentContentStatusService);
    studentContentStatusApi = TestBed.get(StudentContentStatusApi);
    personApi = TestBed.get(PersonApi);
    contentStatusApi = TestBed.get(ContentStatusApi);
  });

  it('should be created', inject(
    [StudentContentStatusService],
    (studentContentStatusService: StudentContentStatusService) => {
      expect(studentContentStatusService).toBeTruthy();
    }
  ));

  it('updateStudentContentStatus should call studentContentStatusApi.patchAttributes', () => {
    spyOn(studentContentStatusApi, 'patchAttributes');
    const studentContentStatus = new StudentContentStatusFixture();

    service.updateStudentContentStatus(studentContentStatus);

    expect(studentContentStatusApi.patchAttributes).toHaveBeenCalledWith(
      studentContentStatus.id,
      {
        contentStatusId: studentContentStatus.contentStatusId
      }
    );
  });

  it('addStudentContentStatus should call personApi.createStudentContentStatuses', () => {
    spyOn(personApi, 'createStudentContentStatuses');
    const studentContentStatus = new StudentContentStatusFixture();

    service.addStudentContentStatus(studentContentStatus);

    expect(personApi.createStudentContentStatuses).toHaveBeenCalledWith(
      studentContentStatus.personId,
      studentContentStatus
    );
  });

  it('getAllContentStatuses should call contentStatusApi.find', () => {
    spyOn(contentStatusApi, 'find');

    service.getAllContentStatuses();
    expect(contentStatusApi.find).toHaveBeenCalledTimes(1);
  });
});
