import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { MockActivatedRoute } from '@campus/testing';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
import { ReportsViewModel } from '../reports.viewmodel';
import { AssignmentResultInterface } from '../reports.viewmodel.interfaces';
import { MockReportsViewModel } from '../reports.viewmodel.mock';
import { ResultsByPersonAndAreaComponent } from './results-by-person-and-area.component';

describe('ResultsByPersonAndAreaComponent', () => {
  let component: ResultsByPersonAndAreaComponent;
  let fixture: ComponentFixture<ResultsByPersonAndAreaComponent>;
  let reportsViewModel: MockReportsViewModel;
  let learningArea$: BehaviorSubject<LearningAreaInterface>;
  let ownResults$: BehaviorSubject<AssignmentResultInterface[]>;
  let activatedRoute: MockActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsByPersonAndAreaComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: ReportsViewModel, useClass: MockReportsViewModel }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsByPersonAndAreaComponent);
    component = fixture.componentInstance;
    reportsViewModel = TestBed.get(ReportsViewModel);
    activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.params.next({ area: 1 });
    fixture.detectChanges();

    learningArea$ = reportsViewModel.getLearningAreaById() as BehaviorSubject<
      LearningAreaInterface
    >;
    ownResults$ = reportsViewModel.getAssignmentResultsByLearningArea() as BehaviorSubject<
      AssignmentResultInterface[]
    >;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the learningArea$ and ownResults$ from the tasksViewModel', () => {
    expect(component.learningArea$).toBeObservable(
      hot('a', { a: learningArea$.value })
    );
    expect(component.ownResults$).toBeObservable(
      hot('a', { a: ownResults$.value })
    );
  });
});
