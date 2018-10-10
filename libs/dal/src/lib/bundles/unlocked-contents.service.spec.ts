import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Subject } from 'rxjs';
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
          useClass: {
            getData: jest.fn(() => mockData$)
          }
        }
      ]
    });
    service = TestBed.get(UnlockedContentsService);
  });

  it('should be created', inject(
    [UnlockedContentsService],
    (unlockedContentsService: UnlockedContentsService) => {
      expect(unlockedContentsService).toBeTruthy();
    }
  ));

  it('should return unlockedContents', () => {});
});
