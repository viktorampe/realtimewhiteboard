import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskContentListItemComponent } from './student-task-content-list-item.component';

describe('StudentTaskContentListItemComponent', () => {
  let component: StudentTaskContentListItemComponent;
  let fixture: ComponentFixture<StudentTaskContentListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTaskContentListItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskContentListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
