import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { UnlockedBoekeGroupService } from './unlocked-boeke-group.service';
import { UnlockedBoekeGroupServiceInterface } from './unlocked-boeke-group.service.interface';

describe('UnlockedBoekeGroupService', () => {
  let service: UnlockedBoekeGroupServiceInterface;
  let mockData$: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnlockedBoekeGroupService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(UnlockedBoekeGroupService);
  });

  it('should be created and available via DI', inject(
    [UnlockedBoekeGroupService],
    (unlockedBoekeGroupService: UnlockedBoekeGroupService) => {
      expect(unlockedBoekeGroupService).toBeTruthy();
    }
  ));

  it('should return unlockedBoekeGroups', async () => {
    mockData$ = hot('-a-|', {
      a: { unlockedBoekeGroups: [{ id: 666 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 666 }]
      })
    );
  });
});
