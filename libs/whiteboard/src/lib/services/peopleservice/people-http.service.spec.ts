import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { PeopleHttpService } from './people-http.service';

describe('PeopleHttpService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        PeopleHttpService,
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
    const service: PeopleHttpService = TestBed.get(PeopleHttpService);
    expect(service).toBeTruthy();
  });
});
