import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskOverviewComponent } from './student-task-overview.component';

describe('StudentTaskOverviewComponent', () => {
  let component: StudentTaskOverviewComponent;
  let fixture: ComponentFixture<StudentTaskOverviewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTaskOverviewComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
