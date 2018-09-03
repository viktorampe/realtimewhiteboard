import { TestBed, inject } from '@angular/core/testing';

import { TaskEduContentsService } from './task-edu-contents.service';

describe('TaskEduContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskEduContentsService]
    });
  });

  it('should be created', inject(
    [TaskEduContentsService],
    (service: TaskEduContentsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
