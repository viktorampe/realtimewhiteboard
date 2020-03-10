import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ENVIRONMENT_UI_TOKEN, UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskOverviewComponent } from './student-task-overview.component';

describe('StudentTaskOverviewComponent', () => {
  let component: StudentTaskOverviewComponent;
  let fixture: ComponentFixture<StudentTaskOverviewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      declarations: [StudentTaskOverviewComponent],
      providers: [{ provide: ENVIRONMENT_UI_TOKEN, useValue: {} }]
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
