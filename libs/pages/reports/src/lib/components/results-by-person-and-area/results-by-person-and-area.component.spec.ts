import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { LearningAreaInterface, ResultFixture } from '@campus/dal';
import { MockActivatedRoute, MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
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
      imports: [UiModule, BrowserAnimationsModule],
      declarations: [ResultsByPersonAndAreaComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: ReportsViewModel, useClass: MockReportsViewModel },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
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

  it('should get the learningArea$ and ownResults$ from the reportsViewModel', () => {
    expect(component.learningArea$).toBeObservable(
      hot('a', { a: learningArea$.value })
    );
    expect(component.ownResults$).toBeObservable(
      hot('a', { a: ownResults$.value })
    );
  });

  it('should call reportsViewModel.openContentForReview from clickOpenContentForReview', () => {
    const result = new ResultFixture();
    spyOn(reportsViewModel, 'openContentForReview');
    component.clickOpenContentForReview(result);

    expect(reportsViewModel.openContentForReview).toHaveBeenCalledTimes(1);
    expect(reportsViewModel.openContentForReview).toHaveBeenCalledWith(result);
  });

  it('should show both task and bundle titles', () => {
    const titles = fixture.debugElement.queryAll(
      By.css('.page-results__table__main th')
    );
    expect(titles.length).toBe(2);
    expect(titles[0].nativeElement.textContent).toContain('foo 1');
    expect(titles[1].nativeElement.textContent).toContain('foo 2');
  });

  it('should show "bundel" or "taak" according to type', () => {
    const exerciseType = fixture.debugElement.queryAll(
      By.css('.page-results__table__main th em')
    );
    expect(exerciseType.length).toBe(2);
    expect(exerciseType[0].nativeElement.textContent).toContain('Taak');
    expect(exerciseType[1].nativeElement.textContent).toContain('Bundel');
  });

  it('should show all exercise titles', () => {
    const exerciseTitle = fixture.debugElement.queryAll(
      By.css('.page-results__table__main td.title')
    );

    expect(exerciseTitle.length).toBe(3);
    expect(exerciseTitle[0].nativeElement.textContent).toContain('foo');
    expect(exerciseTitle[1].nativeElement.textContent).toContain(
      'really long title to check proper wrapping in the template'
    );
    expect(exerciseTitle[2].nativeElement.textContent).toContain('foo');
  });

  it('should show the average score of the task or bundle', () => {
    const exerciseRows = fixture.debugElement.queryAll(
      By.css('.page-results__table__main th')
    );
    expect(exerciseRows.length).toBe(2);

    expect(exerciseRows[0].nativeElement.textContent).toContain('%');
    expect(exerciseRows[1].nativeElement.textContent).toContain('%');
  });

  it('should show all exercise scores', () => {
    const exerciseRows = fixture.debugElement.queryAll(
      By.css('.page-results__table__main tr')
    );
    expect(exerciseRows.length).toBe(3);

    expect(exerciseRows[0].queryAll(By.css('td.number'))[0]).toBeTruthy();
    expect(exerciseRows[1].queryAll(By.css('td.number'))[0]).toBeTruthy();
    expect(exerciseRows[2].queryAll(By.css('td.number'))[0]).toBeTruthy();
  });

  it('should show only bundle exercise tries and averages', () => {
    const exerciseRows = fixture.debugElement.queryAll(
      By.css('.page-results__table__main tr')
    );
    expect(exerciseRows.length).toBe(3);

    // tries
    expect(
      exerciseRows[0].queryAll(By.css('td.number'))[1].nativeElement.textContent
    ).toBeFalsy();
    expect(
      exerciseRows[1].queryAll(By.css('td.number'))[1].nativeElement.textContent
    ).toBeFalsy();
    expect(
      exerciseRows[2].queryAll(By.css('td.number'))[1].nativeElement.textContent
    ).toBeTruthy();

    // averages
    expect(
      exerciseRows[0].queryAll(By.css('td.number'))[2].nativeElement.textContent
    ).toBeFalsy();
    expect(
      exerciseRows[1].queryAll(By.css('td.number'))[2].nativeElement.textContent
    ).toBeFalsy();
    expect(
      exerciseRows[2].queryAll(By.css('td.number'))[2].nativeElement.textContent
    ).toBeTruthy();
  });
});
