import { TestBed, inject } from '@angular/core/testing';

import { UserContentsService } from './user-contents.service';

describe('UserContentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserContentsService]
    });
  });

  it('should be created', inject(
    [UserContentsService],
    (service: UserContentsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
