import { TestBed } from '@angular/core/testing';

import { CustomsubsService } from './customsubs.service';

describe('CustomsubsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomsubsService = TestBed.get(CustomsubsService);
    expect(service).toBeTruthy();
  });
});
