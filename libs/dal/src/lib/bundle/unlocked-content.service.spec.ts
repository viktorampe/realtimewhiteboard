import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { UnlockedContentService } from './unlocked-content.service';
import { UnlockedContentServiceInterface } from './unlocked-content.service.interface';

describe('UnlockedContentService', () => {
  let service: UnlockedContentServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnlockedContentService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(UnlockedContentService);
  });

  it('should be created and available via DI', inject(
    [UnlockedContentService],
    (unlockedContentService: UnlockedContentService) => {
      expect(unlockedContentService).toBeTruthy();
    }
  ));

  it('should return unlockedContents', () => {
    mockData$ = hot('-a-|', {
      a: {
        unlockedContents: [
          {
            id: 1,
            name: 'name',
            description: 'description',
            type: 'type'
          }
        ]
      }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [
          {
            id: 1,
            name: 'name',
            description: 'description',
            type: 'type'
          }
        ]
      })
    );
  });
});
