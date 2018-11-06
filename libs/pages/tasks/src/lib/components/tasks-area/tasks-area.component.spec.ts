import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListFormat } from '@campus/ui';
import { hot } from 'jasmine-marbles';
import { BehaviorSubject } from 'rxjs';
import { TasksViewModel } from '../tasks.viewmodel';
import { LearningAreasWithTaskInstanceInfoInterface } from '../tasks.viewmodel.interfaces';
import { MockTasksViewModel } from '../tasks.viewmodel.mock';
import { TasksAreaComponent } from './tasks-area.component';

describe('TasksAreaComponent', () => {
  let component: TasksAreaComponent;
  let fixture: ComponentFixture<TasksAreaComponent>;
  let tasksViewModel: TasksViewModel;
  let learningAreas$: BehaviorSubject<
    LearningAreasWithTaskInstanceInfoInterface
  >;
  let learningAreasValue: LearningAreasWithTaskInstanceInfoInterface;
  let listFormat$: BehaviorSubject<ListFormat>;
  let listFormatValue: ListFormat;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TasksAreaComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: TasksViewModel, useClass: MockTasksViewModel }]
    }).compileComponents();

    tasksViewModel = TestBed.get(TasksViewModel);

    learningAreas$ = tasksViewModel.learningAreasWithTaskInstances$ as BehaviorSubject<
      LearningAreasWithTaskInstanceInfoInterface
    >;
    learningAreasValue = learningAreas$.value;

    listFormat$ = tasksViewModel.listFormat$ as BehaviorSubject<ListFormat>;
    listFormatValue = listFormat$.value;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty filterInput string', () => {
    expect(component.filterInput$).toBeObservable(hot('a', { a: '' }));
  });

  it('should reset the filterInput$ when calling resetFilterInput', () => {
    component.filterInput$.next('not empty');
    component.resetFilterInput();
    expect(component.filterInput$).toBeObservable(hot('a', { a: '' }));
  });

  it('should change the filterInput$ when calling onChangeFilterInput', () => {
    component.onChangeFilterInput('the new value');
    expect(component.filterInput$).toBeObservable(
      hot('a', { a: 'the new value' })
    );
  });

  it('should call the viewModel changeListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(tasksViewModel, 'changeListFormat');

    component.clickChangeListFormat(ListFormat.LINE);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ListFormat.LINE);

    component.clickChangeListFormat(ListFormat.GRID);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(ListFormat.GRID);
  });

  it('should get the listFormat$ and learningAreas$ from the tasksViewModel', () => {
    expect(component.listFormat$).toBeObservable(
      hot('a', { a: listFormatValue })
    );
    expect(component.learningAreas$).toBeObservable(
      hot('a', { a: learningAreasValue })
    );
  });

  it('should filter the learningAreas with case insensitivity and count the totalTasks correctly', () => {
    const filterInput$ = hot('abc|', {
      a: undefined,
      b: 'wISKUN',
      c: 'nothing nothing nothing'
    });

    // Alles
    const expectedA = learningAreasValue;

    // Enkel wiskunde
    const expectedB = {
      learningAreas: [
        {
          learningArea: {
            name: 'Wiskunde',
            icon: 'wiskunde',
            color: '#2c354f'
          },
          openTasks: 2,
          closedTasks: 3
        }
      ],
      totalTasks: 5
    };

    // Leeg
    const expectedC = { learningAreas: [], totalTasks: 0 };

    expect(
      component.getDisplayedLearningAreas$(learningAreas$, filterInput$)
    ).toBeObservable(
      hot('abc', {
        a: expectedA,
        b: expectedB,
        c: expectedC
      })
    );
  });

  it('should show the placeholder text when no learningAreas are available', () => {
    const placeholderText = 'Er zijn momenteel geen taken voor jou klaargezet.';

    learningAreas$.next({ learningAreas: [], totalTasks: 0 });
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(
      By.css('.pages-tasks__container')
    );

    expect(componentDE.nativeElement.textContent).toBe(placeholderText);
  });

  it('should show the amount of available learningAreas', () => {
    const amountOfAreasText = '3 van 3 weergegeven';

    const componentDE = fixture.debugElement.query(
      By.css('.pages-tasks__container')
    );

    expect(componentDE.nativeElement.textContent).toContain(amountOfAreasText);
  });

  it('should show the amount of tasks per learningArea', () => {
    const amountOfOpenTasksText = '2 open taken';
    const amountOfClosedTasksText = '3 gesloten taken';

    const folderDE = fixture.debugElement.query(By.css('campus-folder'));

    expect(folderDE.nativeElement.textContent).toContain(amountOfOpenTasksText);
    expect(folderDE.nativeElement.textContent).toContain(
      amountOfClosedTasksText
    );
  });
});
