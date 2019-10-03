import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { EditorHttpService } from './editor-http.service';
import { EditorHttpServiceInterface } from './editor-http.service.interface';

describe('EditorHttpService', () => {
  let editorHttpService: EditorHttpServiceInterface;

  configureTestSuite(() => {
    TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    editorHttpService = TestBed.get(EditorHttpService);
  });

  it('should create', () => {
    expect(editorHttpService).toBeTruthy();
  });
});
