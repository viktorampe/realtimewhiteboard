import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { cold } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { CardFixture } from '../models/card.fixture';
import { WhiteboardFixture } from '../models/whiteboard.fixture';
import {
  WhiteboardHttpService,
  WhiteboardHttpServiceInterface
} from './whiteboard-http.service';

describe('WhiteboardHttpService', () => {
  let whiteboardHttpService: WhiteboardHttpServiceInterface;
  let httpClient: HttpClient;

  const APIBase = 'http://some.website.address/api';
  const metadataId = 22;

  const mockWhiteboard = new WhiteboardFixture({
    shelfCards: [new CardFixture(), new CardFixture()],
    cards: [new CardFixture(), new CardFixture()]
  });
  const apiData = {
    data: JSON.stringify(mockWhiteboard),
    eduContentId: 1
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        WhiteboardHttpService,
        {
          provide: HttpClient,
          useValue: {
            get: () => {},
            patch: () => {},
            post: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    whiteboardHttpService = TestBed.get(WhiteboardHttpService);
    httpClient = TestBed.get(HttpClient);
    whiteboardHttpService.setSettings({
      apiBase: APIBase,
      metadataId: metadataId
    });
    whiteboardHttpService['eduContentId'] = apiData.eduContentId;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it('should be created', () => {
    const service: WhiteboardHttpService = TestBed.get(WhiteboardHttpService);
    expect(service).toBeTruthy();
  });

  describe('getJson', () => {
    beforeEach(() => {
      httpClient.get = jest.fn().mockReturnValue(of(apiData));
    });

    it('should make the correct api call and return the response', () => {
      expect(whiteboardHttpService.getJson()).toBeObservable(
        cold('(a|)', { a: mockWhiteboard })
      );

      expect(httpClient.get).toHaveBeenCalledWith(
        APIBase + '/eduContentMetadata/' + metadataId,
        { withCredentials: true }
      );
    });
  });

  describe('setJson', () => {
    beforeEach(() => {
      httpClient.patch = jest.fn().mockReturnValue(of(apiData));
    });

    it('should make the correct api call and return the response', () => {
      expect(whiteboardHttpService.setJson(mockWhiteboard)).toBeObservable(
        cold('(a|)', { a: true })
      );

      expect(httpClient.patch).toHaveBeenCalledWith(
        APIBase + '/eduContentMetadata/' + metadataId,
        { data: JSON.stringify(mockWhiteboard) },
        { withCredentials: true }
      );
    });
  });
});
