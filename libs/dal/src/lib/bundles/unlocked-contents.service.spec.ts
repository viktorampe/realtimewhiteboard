import { TestBed, inject } from '@angular/core/testing';

import { UnlockedContentsService } from './unlocked-contents.service';

describe('UnlockedContentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnlockedContentsService]
    });
  });

  it('should be created', inject([UnlockedContentsService], (service: UnlockedContentsService) => {
    expect(service).toBeTruthy();
  }));
});
