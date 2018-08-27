import { TestBed, inject } from '@angular/core/testing';

import { UnlockedContentService } from './unlocked-content.service';

describe('UnlockedContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnlockedContentService]
    });
  });

  it('should be created', inject([UnlockedContentService], (service: UnlockedContentService) => {
    expect(service).toBeTruthy();
  }));
});
