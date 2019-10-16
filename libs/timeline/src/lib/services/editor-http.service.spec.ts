import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { cold } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { TimelineConfigFixture } from '../+fixtures/timeline-config.fixture';
import { ENVIRONMENT_API_TOKEN } from '../interfaces/environment';
import { EditorHttpService } from './editor-http.service';
import {
  EditorHttpServiceInterface,
  StorageInfoInterface
} from './editor-http.service.interface';

describe('EditorHttpService', () => {
  let editorHttpService: EditorHttpServiceInterface;
  let httpClient: HttpClient;

  const APIBase = 'http://some.website.address';
  const mockTimeline = new TimelineConfigFixture();
  const apiData = { timeline: JSON.stringify(mockTimeline), eduContentId: 1 };
  const requestMetadataId = 123;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        EditorHttpService,
        {
          provide: HttpClient,
          useValue: {
            get: () => {},
            put: () => {},
            post: () => {}
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
    editorHttpService.setSettings({
      apiBase: APIBase,
      eduContentMetadataId: requestMetadataId
    });
    editorHttpService['eduContentId'] = apiData.eduContentId;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should be created and available via DI', inject(
    [EditorHttpService],
    (service: EditorHttpService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('getJson', () => {
    beforeEach(() => {
      httpClient.get = jest.fn().mockReturnValue(of(apiData));
    });

    it('should make the correct api call and return the response', () => {
      expect(editorHttpService.getJson()).toBeObservable(
        cold('(a|)', { a: mockTimeline })
      );

      expect(httpClient.get).toHaveBeenCalledWith(
        APIBase +
          '/api/eduContentMetadata/' +
          requestMetadataId +
          '?filter={"fields":["timeline","eduContentId"]}',
        { withCredentials: true }
      );
    });
  });

  describe('setJson', () => {
    beforeEach(() => {
      // actual call returns entire eduContentMetadata
      // but response is mapped to a boolean, so it doesn't matter
      httpClient.put = jest.fn().mockReturnValue(of(apiData));
    });

    it('should make the correct api call and return the response', () => {
      expect(editorHttpService.setJson(mockTimeline)).toBeObservable(
        cold('(a|)', { a: true })
      );

      expect(httpClient.put).toHaveBeenCalledWith(
        APIBase + '/api/eduContentMetadata/' + requestMetadataId,
        { timeline: JSON.stringify(mockTimeline) },
        { withCredentials: true }
      );
    });
  });

  describe('uploadFile', () => {
    const storageInfo: StorageInfoInterface = {
      name: 'foo.exe',
      storageName: 'some-hash'
    };

    const file = new File([], 'foo.exe');

    const formData = new FormData();
    formData.append('file', file, file.name);

    beforeEach(() => {
      httpClient.post = jest.fn().mockReturnValue(of(storageInfo));
    });

    it('should make the correct api call and return the response', () => {
      expect(editorHttpService.uploadFile(file)).toBeObservable(
        cold('(a|)', { a: storageInfo })
      );

      expect(httpClient.post).toHaveBeenCalledWith(
        APIBase + '/api/EduContentFiles/' + apiData.eduContentId + '/store',
        formData,
        { withCredentials: true }
      );
    });
  });

  describe('getPreviewUrl', () => {
    it('should make the correct api call and return the response', () => {
      const previewUrl = editorHttpService.getPreviewUrl();

      const expected =
        APIBase +
        '/api/eduContents/' +
        apiData.eduContentId +
        '/redirectURL/' +
        requestMetadataId;

      expect(previewUrl).toEqual(expected);
    });
  });
});
