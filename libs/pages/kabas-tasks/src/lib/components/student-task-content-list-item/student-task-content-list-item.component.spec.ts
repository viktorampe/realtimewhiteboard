import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { ResultStatus } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskContentListItemComponent } from './student-task-content-list-item.component';

describe('StudentTaskContentListItemComponent', () => {
  let component: StudentTaskContentListItemComponent;
  let fixture: ComponentFixture<StudentTaskContentListItemComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, UiModule],
      declarations: [StudentTaskContentListItemComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskContentListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Result info: ', () => {
    const testCases = [
      {
        finished: true,
        required: true,
        status: ResultStatus.STATUS_COMPLETED,
        expected: {
          rating: true,
          icon: 'completed'
        }
      },
      {
        finished: true,
        required: true,
        status: ResultStatus.STATUS_INCOMPLETE,
        expected: {
          rating: true,
          icon: 'incompleted'
        }
      },
      {
        finished: true,
        required: false,
        status: ResultStatus.STATUS_COMPLETED,
        expected: {
          rating: true,
          icon: 'completed'
        }
      },
      {
        finished: true,
        required: false,
        status: ResultStatus.STATUS_INCOMPLETE,
        expected: {
          rating: false,
          icon: false
        }
      },
      {
        finished: false,
        required: true,
        status: ResultStatus.STATUS_COMPLETED,
        expected: {
          rating: false,
          icon: 'completed'
        }
      },
      {
        finished: false,
        required: true,
        status: ResultStatus.STATUS_OPENED,
        expected: {
          rating: false,
          icon: 'opened'
        }
      },
      {
        finished: false,
        required: true,
        status: ResultStatus.STATUS_INCOMPLETE,
        expected: {
          rating: false,
          icon: false
        }
      },
      {
        finished: false,
        required: false,
        status: ResultStatus.STATUS_COMPLETED,
        expected: {
          rating: false,
          icon: 'completed'
        }
      },
      {
        finished: false,
        required: false,
        status: ResultStatus.STATUS_INCOMPLETE,
        expected: {
          rating: false,
          icon: false
        }
      }
    ];

    testCases.forEach(testCase => {
      let when = 'when ';
      when += (testCase.finished ? '' : 'not ') + 'finished, ';
      when += (testCase.required ? '' : 'not ') + 'required, ';
      when += testCase.status;
      let should = 'should ';
      should += (testCase.expected.rating ? '' : 'not ') + 'show rating, ';
      should += 'should ';
      should += testCase.expected.icon
        ? 'show ' + testCase.expected.icon + ' icon'
        : 'not show icon';

      describe(when, () => {
        it(should, () => {
          component.lastUpdated = new Date();
          component.isFinished = testCase.finished;
          component.isRequired = testCase.required;
          component.status = testCase.status;
          fixture.detectChanges();

          const ratingDE = fixture.debugElement.query(
            By.css('.student-task-content-list-item__score')
          );
          if (testCase.expected.rating) {
            expect(ratingDE).toBeDefined();
          } else {
            expect(ratingDE).toBeNull();
          }

          const lastUpdatedDE = fixture.debugElement.query(
            By.css('.student-task-content-list-item__last-updated')
          );
          if (testCase.expected.icon) {
            const selector =
              '.student-task-content-list-item__status-icon--' +
              testCase.expected.icon;
            expect(lastUpdatedDE.query(By.css(selector))).toBeDefined();
          } else {
            if (testCase.finished) {
              expect(lastUpdatedDE.query(By.directive(MatIcon))).toBeNull();
            } else {
              expect(lastUpdatedDE).toBeNull();
            }
          }
        });
      });
    });
  });
});
