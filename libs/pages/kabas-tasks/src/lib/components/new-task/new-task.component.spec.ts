import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LearningAreaFixture } from '@campus/dal';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { NewTaskComponent } from './new-task.component';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;
  const learningAreas = [
    new LearningAreaFixture({ id: 1, name: 'Frans' }),
    new LearningAreaFixture({ id: 2, name: 'Wiskunde' })
  ];
  const mockInjectedData = { learningAreas };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        UiModule,
        MatDialogModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [NewTaskComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockInjectedData },
        { provide: MatDialogRef, useValue: { close: jest.fn() } }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
