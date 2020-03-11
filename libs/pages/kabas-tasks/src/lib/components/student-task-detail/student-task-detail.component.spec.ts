import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ENVIRONMENT_UI_TOKEN, UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskDetailComponent } from './student-task-detail.component';

describe('StudentTaskDetailComponent', () => {
  let component: StudentTaskDetailComponent;
  let fixture: ComponentFixture<StudentTaskDetailComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, UiModule],
      providers: [
        {
          provide: ENVIRONMENT_UI_TOKEN,
          useValue: {}
        }
      ],
      declarations: [StudentTaskDetailComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
