import { TestBed } from '@angular/core/testing';

import { UnlockedFreePracticeService } from './unlocked-free-practice.service';

describe('UnlockedFreePracticeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnlockedFreePracticeService = TestBed.get(UnlockedFreePracticeService);
    expect(service).toBeTruthy();
  });
});
