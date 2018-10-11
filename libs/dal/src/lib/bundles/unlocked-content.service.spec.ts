import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Subject } from 'rxjs';
import { UnlockedContentInterface } from '../+models';
import { UnlockedContentService } from './unlocked-content.service';
import { UnlockedContentServiceInterface } from './unlocked-content.service.interface';

describe('UnlockedContentService', () => {
  let service: UnlockedContentServiceInterface;
  const mockData$: Subject<object> = new Subject();

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

  it('should return unlockedContents', async () => {
    service.getAllForUser(1).subscribe(res => {
      expect(res).toEqual([<UnlockedContentInterface>{ id: 1, index: 10 }]);
    });
    // emit after subscription!
    mockData$.next({ unlockedContents: [{ id: 1, index: 10 }] });
  });
});
