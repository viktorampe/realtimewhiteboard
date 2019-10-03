import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { EditorViewModel } from './editor.viewmodel';

describe('EditorViewModel', () => {
  let editorViewModel: EditorViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    editorViewModel = TestBed.get(EditorViewModel);
  });
});
