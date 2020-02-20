import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { WhiteboardHttpService } from './whiteboard-http.service';

describe('WhiteboardHttpService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        WhiteboardHttpService,
        {
          provide: HttpClient,
          useValue: {
            get: () => {},
            patch: () => {},
            post: () => {}
          }
        }
      ]
    })
  );

  it('should be created', () => {
    const service: WhiteboardHttpService = TestBed.get(WhiteboardHttpService);
    expect(service).toBeTruthy();
  });
});
