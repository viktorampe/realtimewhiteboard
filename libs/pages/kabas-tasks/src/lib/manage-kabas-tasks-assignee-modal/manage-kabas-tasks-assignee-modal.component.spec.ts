import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageKabasTasksAssigneeModalComponent } from './manage-kabas-tasks-assignee-modal.component';

describe('ManageKabasTasksAssigneeModalComponent', () => {
  let component: ManageKabasTasksAssigneeModalComponent;
  let fixture: ComponentFixture<ManageKabasTasksAssigneeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageKabasTasksAssigneeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksAssigneeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
