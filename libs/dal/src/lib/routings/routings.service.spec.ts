import { TestBed, inject } from '@angular/core/testing';

import { RoutingsService } from './routings.service';

describe('RoutingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutingsService]
    });
  });

  it('should be created', inject([RoutingsService], (service: RoutingsService) => {
    expect(service).toBeTruthy();
  }));
});
