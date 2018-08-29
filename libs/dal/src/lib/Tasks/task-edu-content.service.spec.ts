import { TestBed, inject } from '@angular/core/testing';

import { TaskEduContentService } from './task-edu-content.service';

describe('TaskEduContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskEduContentService]
    });
  });

  it('should be created', inject([TaskEduContentService], (service: TaskEduContentService) => {
    expect(service).toBeTruthy();
  }));
});
