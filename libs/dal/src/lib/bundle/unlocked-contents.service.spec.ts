import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { UnlockedContentsService } from './unlocked-contents.service';
import { UnlockedContentsServiceInterface } from './unlocked-contents.service.interface';

describe('UnlockedContentsService', () => {
  let service: UnlockedContentsServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnlockedContentsService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(UnlockedContentsService);
  });

  it('should be created and available via DI', inject(
    [UnlockedContentsService],
    (unlockedContentsService: UnlockedContentsService) => {
      expect(unlockedContentsService).toBeTruthy();
    }
  ));

  it('should return unlockedContents', () => {
    mockData$ = hot('-a-|', {
      a: { unlockedContents: [{ id: 1, index: 10 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 1, index: 10 }]
      })
    );
  });
});
