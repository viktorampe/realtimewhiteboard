import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskListItemComponent } from './student-task-list-item.component';

describe('StudentTaskListItemComponent', () => {
  let component: StudentTaskListItemComponent;
  let fixture: ComponentFixture<StudentTaskListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentTaskListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
