import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTasksOverviewComponent } from './manage-tasks-overview.component';

describe('ManageTasksOverviewComponent', () => {
  let component: ManageTasksOverviewComponent;
  let fixture: ComponentFixture<ManageTasksOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTasksOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTasksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
