import { TestBed, inject } from '@angular/core/testing';

import { BundlesService } from './bundles.service';

describe('BundlesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BundlesService]
    });
  });

  it('should be created', inject([BundlesService], (service: BundlesService) => {
    expect(service).toBeTruthy();
  }));
});
