import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { TaskEduContentsService } from './task-edu-contents.service';

class MockPersonApi {}

describe('TaskEduContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskEduContentsService,
        { provide: PersonApi, useClass: MockPersonApi }
      ]
    });
  });

  it('should be created', inject(
    [TaskEduContentsService],
    (service: TaskEduContentsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
