import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { TimelineConfigFixture } from '../+fixtures/timeline-config.fixture';
import { TimelineConfigInterface } from '../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import { EditorHttpServiceInterface } from '../services/editor-http.service.interface';
import { ENVIRONMENT_API_TOKEN } from './../interfaces/environment';
import { EditorViewModel } from './editor.viewmodel';

describe('EditorViewModel', () => {
  let editorViewModel: EditorViewModel;
  let editorHttpService: EditorHttpServiceInterface;

  const APIBase = 'http://api.kabas.localhost:3000';

  const timelineConfig = new TimelineConfigFixture();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, HttpClientModule],
      providers: [
        {
          provide: EDITOR_HTTP_SERVICE_TOKEN,
          useValue: {
            getJson: () => new BehaviorSubject(timelineConfig),
            setJson: () => {},
            getPreviewUrl: () => {},
            uploadFile: () => {}
          }
        },
        { provide: ENVIRONMENT_API_TOKEN, useValue: { APIBase } }
      ]
    });
  });

  beforeEach(() => {
    editorViewModel = TestBed.get(EditorViewModel);
    editorHttpService = TestBed.get(EDITOR_HTTP_SERVICE_TOKEN);
  });

  it('should create', () => {
    expect(editorViewModel).toBeTruthy();
  });

  describe('handlers', () => {
    const eduContentMetadataId = 1;
    const eduContentId = 1;

    it('getTimeline() should call the editorHttpService.getJson', () => {
      jest.spyOn(editorHttpService, 'getJson');

      editorViewModel.getTimeline(eduContentMetadataId);
      expect(editorHttpService.getJson).toHaveBeenCalledWith(
        eduContentMetadataId
      );
    });

    it('setTimeline() should call the editorHttpService.setJson', () => {
      const data: TimelineConfigInterface = {
        events: [],
        eras: [],
        options: {}
      };
      jest.spyOn(editorHttpService, 'setJson');

      editorViewModel.updateTimeline(eduContentMetadataId, data);
      expect(editorHttpService.setJson).toHaveBeenCalledWith(
        eduContentMetadataId,
        data
      );
    });

    it('previewTimeline() should call the editorHttpService.getPreviewUrl', () => {
      jest.spyOn(editorHttpService, 'getPreviewUrl');

      editorViewModel.previewTimeline(eduContentId, eduContentMetadataId);
      expect(editorHttpService.getPreviewUrl).toHaveBeenCalledWith(
        eduContentId,
        eduContentMetadataId
      );
    });

    it('uploadFile() should call the editorHttpService.uploadFile', () => {
      const file: File = {} as File;

      jest.spyOn(editorHttpService, 'uploadFile');

      editorViewModel.uploadFile(eduContentId, file);
      expect(editorHttpService.uploadFile).toHaveBeenCalledWith(
        eduContentId,
        file
      );
    });
  });
});
