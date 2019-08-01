import { TestBed } from '@angular/core/testing';

import { UserLessonService } from './user-lesson.service';

describe('UserLessonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLessonService = TestBed.get(UserLessonService);
    expect(service).toBeTruthy();
  });
});
