import { TestBed } from '@angular/core/testing';

import { DiaboloPhaseService } from './diabolo-phase.service';

describe('DiaboloPhaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiaboloPhaseService = TestBed.get(DiaboloPhaseService);
    expect(service).toBeTruthy();
  });
});
