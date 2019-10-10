import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SETTINGS_SERVICE_TOKEN, TimelineModule } from '@campus/timeline';
import { configureTestSuite } from 'ng-bullet';
import { TimelineEditorComponent } from './timeline-editor.component';

describe('TimelineEditorComponent', () => {
  let component: TimelineEditorComponent;
  let fixture: ComponentFixture<TimelineEditorComponent>;
  let APIBase: string;
  let eduContentMetadataId: number;
  let eduContentId: number;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TimelineModule],
      declarations: [TimelineEditorComponent],
      providers: [
        {
          provide: SETTINGS_SERVICE_TOKEN,
          useValue: {
            APIBase,
            eduContentMetadataId,
            eduContentId
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    APIBase = 'http://foo.localhost/';
    eduContentMetadataId = 1;
    eduContentId = 1;

    fixture = TestBed.createComponent(TimelineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
