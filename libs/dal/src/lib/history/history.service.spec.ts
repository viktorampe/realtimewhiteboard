import { TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { HistoryFixture } from '../+fixtures/History.fixture';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let historyService: HistoryService;
  let personApi: PersonApi;
  const mockUserId = 1;
  const mockHistory = new HistoryFixture();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PersonApi,
          useValue: {
            getHistory: () => {},
            createHistory: () => {},
            destroyByIdHistory: () => {}
          }
        }
      ]
    });
    historyService = TestBed.get(HistoryService);
    personApi = TestBed.get(PersonApi);
  });

  it('should be created', () => {
    const service: HistoryService = TestBed.get(HistoryService);
    expect(service).toBeTruthy();
  });

  describe('getAllForUser', () => {
    it('should get the history from the api', () => {
      const mockReturnValue = [mockHistory, mockHistory];
      jest.spyOn(personApi, 'getHistory').mockReturnValue(of(mockReturnValue));

      const response = historyService.getAllForUser(mockUserId);

      expect(response).toBeObservable(cold('(a|)', { a: mockReturnValue }));
    });
  });

  describe('addHistory', () => {
    it('should call the api and return the created history', () => {
      jest.spyOn(personApi, 'createHistory').mockReturnValue(of(mockHistory));

      const response = historyService.addHistory(mockUserId, {
        ...mockHistory,
        id: null // we don't know the id yet
      });

      expect(response).toBeObservable(cold('(a|)', { a: mockHistory }));
    });
  });

  describe('deleteHistory', () => {
    it('should call the api and return true', () => {
      jest.spyOn(personApi, 'destroyByIdHistory').mockReturnValue(of(null));

      const response = historyService.deleteHistory(mockUserId, mockHistory.id);

      expect(personApi.destroyByIdHistory).toHaveBeenCalledWith(
        mockUserId,
        mockHistory.id
      );

      expect(response).toBeObservable(cold('(a|)', { a: true }));
    });
  });
});
