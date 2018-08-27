import { TestBed, inject } from '@angular/core/testing';

import { EduContentService } from './edu-content.service';

describe('EduContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EduContentService]
    });
  });

  it('should be created', inject([EduContentService], (service: EduContentService) => {
    expect(service).toBeTruthy();
  }));
});
