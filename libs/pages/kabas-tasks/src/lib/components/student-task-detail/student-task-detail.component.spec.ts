import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ResultStatus } from '@campus/dal';
import { ENVIRONMENT_UI_TOKEN, UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskContentFixture } from '../../interfaces/StudentTaskContent.fixture';
import { StudentTasksViewModel } from '../student-tasks.viewmodel';
import { MockStudentTasksViewModel } from '../student-tasks.viewmodel.mock';
import { StudentTaskDetailComponent } from './student-task-detail.component';

describe('StudentTaskDetailComponent', () => {
  let component: StudentTaskDetailComponent;
  let fixture: ComponentFixture<StudentTaskDetailComponent>;
  let viewModel: MockStudentTasksViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, UiModule],
      providers: [
        {
          provide: ENVIRONMENT_UI_TOKEN,
          useValue: {}
        },
        {
          provide: StudentTasksViewModel,
          useClass: MockStudentTasksViewModel
        }
      ],
      declarations: [StudentTaskDetailComponent]
    });
  });

  beforeEach(() => {
    viewModel = TestBed.get(StudentTasksViewModel);
    fixture = TestBed.createComponent(StudentTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('streams', () => {
    const mockContents = [
      new StudentTaskContentFixture({
        name: 'Required 1',
        required: true,
        status: ResultStatus.STATUS_COMPLETED
      }),
      new StudentTaskContentFixture({
        name: 'Required 2',
        required: true
      }),
      new StudentTaskContentFixture({
        name: 'Optional 1',
        required: false,
        status: ResultStatus.STATUS_COMPLETED
      }),
      new StudentTaskContentFixture({
        name: 'Optional 2',
        required: false
      })
    ];

    beforeEach(() => {
      viewModel.currentTask$.next({
        ...viewModel.currentTask$.value,
        contents: mockContents
      });
    });

    describe('requiredTaskContents', () => {
      it('should contain only required task contents', () => {
        expect(component.requiredTaskContents$).toBeObservable(
          hot('a', {
            a: [mockContents[0], mockContents[1]]
          })
        );
      });
    });

    describe('optionalTaskContents', () => {
      it('should contain only optional task contents', () => {
        expect(component.optionalTaskContents$).toBeObservable(
          hot('a', {
            a: [mockContents[2], mockContents[3]]
          })
        );
      });
    });

    describe('taskProgress', () => {
      it('should contain info from completed tasks', () => {
        expect(component.taskProgress$).toBeObservable(
          hot('a', {
            a: {
              count: 2,
              finished: 1
            }
          })
        );
      });
    });
  });
});
