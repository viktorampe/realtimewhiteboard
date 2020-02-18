import { TestBed } from '@angular/core/testing';

import { WhiteboardHttpService } from './whiteboard-http.service';

describe('WhiteboardHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WhiteboardHttpService = TestBed.get(WhiteboardHttpService);
    expect(service).toBeTruthy();
  });
});
