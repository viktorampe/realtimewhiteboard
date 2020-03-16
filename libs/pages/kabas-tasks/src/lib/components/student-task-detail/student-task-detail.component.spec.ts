import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ResultStatus } from '@campus/dal';
import { MockDate, MockMatIconRegistry } from '@campus/testing';
import { ENVIRONMENT_UI_TOKEN, UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskContentFixture } from '../../interfaces/StudentTaskContent.fixture';
import { StudentTaskContentListItemComponent } from '../student-task-content-list-item/student-task-content-list-item.component';
import { StudentTasksViewModel } from '../student-tasks.viewmodel';
import { MockStudentTasksViewModel } from '../student-tasks.viewmodel.mock';
import { StudentTaskDetailComponent } from './student-task-detail.component';

describe('StudentTaskDetailComponent', () => {
  let component: StudentTaskDetailComponent;
  let fixture: ComponentFixture<StudentTaskDetailComponent>;
  let viewModel: MockStudentTasksViewModel;

  const today = new Date(2020, 2, 9);
  const yesterday = new Date(2020, 2, 8);
  const tomorrow = new Date(2020, 2, 10);
  const dayAfterTomorrow = new Date(2020, 2, 11);
  const thursday = new Date(2020, 2, 12);
  const sunday = new Date(2020, 2, 15);
  const nextWeek = new Date(2020, 2, 16);
  const endNextWeek = new Date(2020, 2, 22);
  const farFuture = new Date(2020, 3, 20);
  const dateMock = new MockDate(today);

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
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ],
      declarations: [
        StudentTaskDetailComponent,
        StudentTaskContentListItemComponent
      ]
    });
  });

  afterAll(() => {
    dateMock.returnRealDate();
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
  });

  describe('dateTimeArguments', () => {
    const testCases = [
      {
        it: 'yesterday',
        input: yesterday,
        expected: 'op ' + yesterday.toLocaleDateString('nl-BE')
      },
      {
        it: 'today',
        input: today,
        expected: 'vandaag'
      },
      {
        it: 'tomorrow',
        input: tomorrow,
        expected: 'morgen'
      },
      {
        it: 'day after tomorrow',
        input: dayAfterTomorrow,
        expected: 'overmorgen'
      },
      {
        it: 'thursday',
        input: thursday,
        expected: 'donderdag'
      },
      {
        it: 'sunday',
        input: sunday,
        expected: 'zondag'
      },
      {
        it: 'next week',
        input: nextWeek,
        expected: 'volgende week'
      },
      {
        it: 'next week - end',
        input: endNextWeek,
        expected: 'volgende week'
      },
      {
        it: 'future',
        input: farFuture,
        expected: 'op ' + farFuture.toLocaleDateString('nl-BE')
      }
    ];

    testCases.forEach(testCase => {
      it(`should return the right date label - ${testCase.it}`, () => {
        viewModel.currentTask$.next({
          ...viewModel.currentTask$.value,
          end: testCase.input,
          isFinished: false
        });
        fixture.detectChanges();

        const finishByCE = fixture.debugElement.query(
          By.css('[data-cy=task-finish-by]')
        );
        const finishByText = finishByCE.nativeElement.textContent.trim();

        expect(finishByText).toEqual(
          'Deze taak moet ' + testCase.expected + ' af zijn.'
        );
      });
    });

    it(`should show a regular date for finished tasks`, () => {
      viewModel.currentTask$.next({
        ...viewModel.currentTask$.value,
        end: endNextWeek,
        isFinished: true
      });
      fixture.detectChanges();

      const finishByCE = fixture.debugElement.query(
        By.css('[data-cy=task-finished-on]')
      );
      const finishByText = finishByCE.nativeElement.textContent.trim();

      expect(finishByText).toEqual(
        'Ingediend op ' + endNextWeek.toLocaleDateString('nl-BE') + '.'
      );
    });
  });
});
