import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TimelineConfigFixture } from '../+fixtures/timeline-config.fixture';
import { TimelineConfigInterface } from '../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import { EditorHttpServiceInterface } from '../services/editor-http.service.interface';
import { EditorViewModel } from './editor.viewmodel';

describe('EditorViewModel', () => {
  let editorViewModel: EditorViewModel;
  let editorHttpService: EditorHttpServiceInterface;

  const APIBase = 'http://api.kabas.localhost:3000';

  const timelineConfig = new TimelineConfigFixture();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        EditorViewModel,
        {
          provide: EDITOR_HTTP_SERVICE_TOKEN,
          useValue: {
            getJson: () => {},
            setJson: () => {},
            getPreviewUrl: () => {},
            uploadFile: () => {}
          }
        }
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
