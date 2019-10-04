import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TimelineConfig } from '../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import { EditorHttpServiceInterface } from '../services/editor-http.service.interface';
import { EditorViewModel } from './editor.viewmodel';

describe('EditorViewModel', () => {
  let editorViewModel: EditorViewModel;
  let editorHttpService: EditorHttpServiceInterface;

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
            openPreview: () => {},
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
    it('getTimeline() should call the editorHttpService.getJson', () => {
      jest.spyOn(editorHttpService, 'getJson');

      editorViewModel.getTimeline(eduContentMetadataId);
      expect(editorHttpService.getJson).toHaveBeenCalledWith(
        eduContentMetadataId
      );
    });

    it('setTimeline() should call the editorHttpService.setJson', () => {
      const data: TimelineConfig = { events: [], eras: [], options: {} };
      jest.spyOn(editorHttpService, 'setJson');

      editorViewModel.updateTimeline(eduContentMetadataId, data);
      expect(editorHttpService.setJson).toHaveBeenCalledWith(
        eduContentMetadataId,
        data
      );
    });

    it('previewTimeline() should call the editorHttpService.openPreview', () => {
      jest.spyOn(editorHttpService, 'openPreview');

      editorViewModel.previewTimeline(eduContentId, eduContentMetadataId);
      expect(editorHttpService.openPreview).toHaveBeenCalledWith(
        eduContentId,
        eduContentMetadataId
      );
    });

    it('uploadFile() should call the editorHttpService.uploadFile', () => {
      const file = 'I am a file';

      jest.spyOn(editorHttpService, 'uploadFile');

      editorViewModel.uploadFile(file);
      expect(editorHttpService.uploadFile).toHaveBeenCalledWith(file);
    });
  });
});
