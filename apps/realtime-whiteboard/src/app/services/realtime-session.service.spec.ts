import { TestBed } from '@angular/core/testing';

import { RealtimeSessionService } from './realtime-session.service';

describe('RealtimeSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RealtimeSessionService = TestBed.get(RealtimeSessionService);
    expect(service).toBeTruthy();
  });
});
