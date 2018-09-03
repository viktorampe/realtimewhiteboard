import { TestBed, inject } from '@angular/core/testing';

import { ContentStatusService } from './content-status.service';

describe('ContentStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentStatusService]
    });
  });

  it('should be created', inject([ContentStatusService], (service: ContentStatusService) => {
    expect(service).toBeTruthy();
  }));
});
