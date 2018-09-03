import { TestBed, inject } from '@angular/core/testing';

import { ContentStatusesService } from './content-statuses.service';

describe('ContentStatusesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentStatusesService]
    });
  });

  it('should be created', inject(
    [ContentStatusesService],
    (service: ContentStatusesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
