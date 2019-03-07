import { TestBed } from '@angular/core/testing';

import { EduNetsService } from './edu-nets.service';

describe('EduNetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EduNetsService = TestBed.get(EduNetsService);
    expect(service).toBeTruthy();
  });
});
