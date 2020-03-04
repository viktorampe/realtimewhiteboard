import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskOverviewComponent } from './student-task-overview.component';

describe('StudentTaskOverviewComponent', () => {
  let component: StudentTaskOverviewComponent;
  let fixture: ComponentFixture<StudentTaskOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentTaskOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
