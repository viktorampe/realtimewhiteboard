import { TestBed } from '@angular/core/testing';
import { HistoryApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { HistoryFixture } from '../+fixtures/History.fixture';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let historyService: HistoryService;
  let personApi: PersonApi;
  let historyApi: HistoryApi;
  const mockUserId = 1;
  const mockHistory = new HistoryFixture({ taskId: 2 });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HistoryApi,
          useValue: {
            upsertByInstance: () => {}
          }
        },
        {
          provide: PersonApi,
          useValue: {
            getHistory: () => {},
            destroyByIdHistory: () => {}
          }
        }
      ]
    });
    historyService = TestBed.get(HistoryService);
    personApi = TestBed.get(PersonApi);
    historyApi = TestBed.get(HistoryApi);
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  describe('upsertHistory', () => {
    it('should call the api and return the created history', () => {
      const spy = jest
        .spyOn(historyApi, 'upsertByInstance')
        .mockReturnValue(of(mockHistory));

      const response = historyService.upsertHistory(mockHistory);

      expect(spy).toHaveBeenCalledWith(
        mockHistory.name,
        mockHistory.type,
        mockHistory.learningAreaId,
        '',
        0,
        0,
        mockHistory.taskId
      );

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
