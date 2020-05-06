import { TestBed } from '@angular/core/testing';

import { ActiveplayerService } from './activeplayer.service';

describe('ActiveplayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveplayerService = TestBed.get(ActiveplayerService);
    expect(service).toBeTruthy();
  });
});
