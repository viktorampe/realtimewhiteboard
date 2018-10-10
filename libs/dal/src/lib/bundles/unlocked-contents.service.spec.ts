import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Subject } from 'rxjs';
import { UnlockedContentInterface } from '../+models';
import { UnlockedContentsService } from './unlocked-contents.service';
import { UnlockedContentsServiceInterface } from './unlocked-contents.service.interface';

describe('UnlockedContentsService', () => {
  let service: UnlockedContentsServiceInterface;
  const mockData$: Subject<object> = new Subject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnlockedContentsService,
        {
          provide: PersonApi,
          useValue: {
            getData: jest.fn(() => mockData$)
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

  it('should return unlockedContents', async () => {
    service.getAllForUser(1).subscribe(res => {
      expect(res).toEqual([<UnlockedContentInterface>{ id: 1, index: 10 }]);
    });
    // emit after subscription!
    mockData$.next({ unlockedContents: [{ id: 1, index: 10 }] });
  });
});
