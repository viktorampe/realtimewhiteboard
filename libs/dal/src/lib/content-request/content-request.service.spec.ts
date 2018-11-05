import { TestBed, inject } from '@angular/core/testing';

import { ContentRequestService } from './content-request.service';

describe('ContentRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentRequestService]
    });
  });

  it('should be created', inject([ContentRequestService], (service: ContentRequestService) => {
    expect(service).toBeTruthy();
  }));
});
