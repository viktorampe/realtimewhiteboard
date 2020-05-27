import { TestBed } from '@angular/core/testing';

import { CustomsubsciptionsService } from './customsubsciptions.service';

describe('CustomsubsciptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomsubsciptionsService = TestBed.get(CustomsubsciptionsService);
    expect(service).toBeTruthy();
  });
});
