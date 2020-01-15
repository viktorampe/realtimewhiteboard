import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MatNativeDateModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { ManageKabasTasksAssigneeModalComponent } from './manage-kabas-tasks-assignee-modal.component';

describe('ManageKabasTasksAssigneeModalComponent', () => {
  let component: ManageKabasTasksAssigneeModalComponent;
  let fixture: ComponentFixture<ManageKabasTasksAssigneeModalComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        UiModule,
        MatNativeDateModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { currentTaskAssignees: [] } },
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ],
      declarations: [ManageKabasTasksAssigneeModalComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksAssigneeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
