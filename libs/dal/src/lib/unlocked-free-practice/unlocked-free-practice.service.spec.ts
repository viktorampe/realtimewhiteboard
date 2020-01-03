import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold, hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { UnlockedFreePracticeServiceInterface } from '.';
import { UnlockedFreePracticeFixture } from './../+fixtures/UnlockedFreePractice.fixture';
import { UnlockedFreePracticeService } from './unlocked-free-practice.service';

describe('UnlockedFreePracticeService', () => {
  let service: UnlockedFreePracticeServiceInterface;
  let mockData$: any;
  let personApi: PersonApi;

  const userId = 1;
  const mockUnlockedFreePractice = new UnlockedFreePracticeFixture();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        UnlockedFreePracticeService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$,
            createUnlockedFreePractices: () => {},
            deleteManyUnlockedFreePracticeRemote: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(UnlockedFreePracticeService);
    personApi = TestBed.get(PersonApi);
  });

  it('should be created and available via DI', inject(
    [UnlockedFreePracticeService],
    (unlockedFreePracticeService: UnlockedFreePracticeService) => {
      expect(unlockedFreePracticeService).toBeTruthy();
    }
  ));

  describe('getAllForUser', () => {
    it('should return unlockedFreePractices', async () => {
      mockData$ = hot('-a-|', {
        a: { unlockedFreePractices: [mockUnlockedFreePractice] }
      });
      expect(service.getAllForUser(userId)).toBeObservable(
        hot('-a-|', {
          a: [mockUnlockedFreePractice]
        })
      );
    });
  });

  describe('createUnlockedFreePractices', () => {
    it('should call the personApi and return the results ', () => {
      personApi.createUnlockedFreePractices = jest
        .fn()
        .mockReturnValue(of([mockUnlockedFreePractice]));

      const { id, ...ufpWithOutId } = mockUnlockedFreePractice;

      expect(
        service.createUnlockedFreePractices(userId, [ufpWithOutId])
      ).toBeObservable(hot('(a|)', { a: [mockUnlockedFreePractice] }));

      expect(personApi.createUnlockedFreePractices).toHaveBeenCalledTimes(1);
      expect(personApi.createUnlockedFreePractices).toHaveBeenCalledWith(
        userId,
        [ufpWithOutId]
      );
    });
  });

  describe('deleteUnlockedFreePractices', () => {
    it('should call the api and return true', () => {
      personApi.deleteManyUnlockedFreePracticeRemote = jest
        .fn()
        .mockReturnValue(of(null));

      const response = service.deleteUnlockedFreePractices(userId, [
        mockUnlockedFreePractice.id
      ]);

      expect(
        personApi.deleteManyUnlockedFreePracticeRemote
      ).toHaveBeenCalledWith(userId, [mockUnlockedFreePractice.id]);

      expect(response).toBeObservable(cold('(a|)', { a: true }));
    });
  });
});
