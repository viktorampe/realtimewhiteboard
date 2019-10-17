import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatStepperModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../../services/editor-http.service';
import { EditorViewModel } from '../editor.viewmodel';
import { MockEditorViewModel } from '../editor.viewmodel.mock';
import { SettingsComponent } from '../settings/settings.component';
import { SlideDetailComponent } from '../slide-detail/slide-detail.component';
import { SlideListComponent } from '../slide-list/slide-list.component';
import { EditorTimelineComponent } from './editor-timeline.component';

describe('EditorTimelineComponent', () => {
  let component: EditorTimelineComponent;
  let fixture: ComponentFixture<EditorTimelineComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatStepperModule,
        MatIconModule,
        MatSlideToggleModule,
        NoopAnimationsModule
      ],
      declarations: [
        EditorTimelineComponent,
        SlideListComponent,
        SlideDetailComponent,
        SettingsComponent
      ],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: EditorViewModel, useClass: MockEditorViewModel },
        { provide: EDITOR_HTTP_SERVICE_TOKEN, useValue: {} }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
