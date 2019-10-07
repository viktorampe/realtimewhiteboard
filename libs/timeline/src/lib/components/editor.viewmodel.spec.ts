import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { TimelineConfigFixture } from '../+fixtures/timeline-config.fixture';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import { ENVIRONMENT_API_TOKEN } from './../interfaces/environment';
import { EditorViewModel } from './editor.viewmodel';

describe('EditorViewModel', () => {
  let editorViewModel: EditorViewModel;

  const APIBase = 'http://api.kabas.localhost:3000';

  const timelineConfig = new TimelineConfigFixture();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, HttpClientModule],
      providers: [
        {
          provide: EDITOR_HTTP_SERVICE_TOKEN,
          useValue: {
            getJson: () => new BehaviorSubject(timelineConfig)
          }
        },
        { provide: ENVIRONMENT_API_TOKEN, useValue: { APIBase } }
      ]
    });
  });

  beforeEach(() => {
    editorViewModel = TestBed.get(EditorViewModel);
  });

  it('should create', () => {
    expect(editorViewModel).toBeTruthy();
  });
});
