import { TestBed, inject } from '@angular/core/testing';

import { EduContentsService } from './edu-contents.service';

describe('EduContentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EduContentsService]
    });
  });

  it('should be created', inject([EduContentsService], (service: EduContentsService) => {
    expect(service).toBeTruthy();
  }));
});
