import { TestBed, inject } from '@angular/core/testing';

import { UserContentService } from './user-content.service';

describe('UserContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserContentService]
    });
  });

  it('should be created', inject([UserContentService], (service: UserContentService) => {
    expect(service).toBeTruthy();
  }));
});
