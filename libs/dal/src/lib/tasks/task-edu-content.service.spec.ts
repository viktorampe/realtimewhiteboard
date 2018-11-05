import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { TaskEduContentService } from './task-edu-content.service';

class MockPersonApi {}

describe('TaskEduContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskEduContentService,
        { provide: PersonApi, useClass: MockPersonApi }
      ]
    });
  });

  it('should be created', inject(
    [TaskEduContentService],
    (service: TaskEduContentService) => {
      expect(service).toBeTruthy();
    }
  ));
});
