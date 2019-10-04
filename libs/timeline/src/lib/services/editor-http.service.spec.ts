// file.only
import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Data } from '@angular/router';
import { cold } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { TimelineConfigFixture } from '../+fixtures/timeline-config.fixture';
import { ENVIRONMENT_API_TOKEN } from '../interfaces/environment';
import { EditorHttpService } from './editor-http.service';
import { EditorHttpServiceInterface } from './editor-http.service.interface';

describe('EditorHttpService', () => {
  let editorHttpService: EditorHttpServiceInterface;
  let httpClient: HttpClient;

  const APIBase = 'http://some.website.address';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        EditorHttpService,
        {
          provide: HttpClient,
          useValue: {
            get: () => {}
          }
        },
        {
          provide: ENVIRONMENT_API_TOKEN,
          useValue: { APIBase }
        }
      ]
    });
  });

  beforeEach(() => {
    editorHttpService = TestBed.get(EditorHttpService);
    httpClient = TestBed.get(HttpClient);
  });

  it('should be created and available via DI', inject(
    [EditorHttpService],
    (editorHttpService: EditorHttpService) => {
      expect(editorHttpService).toBeTruthy();
    }
  ));

  describe('getJson', () => {
    const mockTimeline = new TimelineConfigFixture();
    const apiData: Data = { timeline: JSON.stringify(mockTimeline) };

    const requestedMetadataId = 123;

    beforeEach(() => {
      httpClient.get = jest.fn().mockReturnValue(of(apiData));
    });

    it('should make the correct api call and return the response', () => {
      expect(editorHttpService.getJson(requestedMetadataId)).toBeObservable(
        cold('(a|)', { a: mockTimeline })
      );

      expect(httpClient.get).toHaveBeenCalledWith(
        APIBase +
          '/api/eduContentMetaData/' +
          requestedMetadataId +
          '?filter[fields]=timeline' +
          '&access_token=2' //TODO remove this bit
      );
    });
  });
});
