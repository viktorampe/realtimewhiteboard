import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FilterService,
  FilterServiceInterface,
  FILTER_SERVICE_TOKEN
} from '@campus/shared';
import { ListFormat, UiModule } from '@campus/ui';
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
  let filterService: FilterServiceInterface;

  let learningAreas$: BehaviorSubject<
    LearningAreasWithTaskInstanceInfoInterface
  >;
  let learningAreasValue: LearningAreasWithTaskInstanceInfoInterface;
  let listFormat$: BehaviorSubject<ListFormat>;
  let listFormatValue: ListFormat;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [TasksAreaComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TasksViewModel, useClass: MockTasksViewModel },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService }
      ]
    }).compileComponents();

    tasksViewModel = TestBed.get(TasksViewModel);
    filterService = TestBed.get(FILTER_SERVICE_TOKEN);

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

  it('should call the filter service when filterTextInput.filterFn is called', () => {
    const filterSource = {
      learningAreasWithInfo: []
    } as LearningAreasWithTaskInstanceInfoInterface;
    const filterText = '';

    const spyFilterService = jest.spyOn(filterService, 'filter');
    component.filterTextInput.filterFn(filterSource, filterText);

    expect(spyFilterService).toHaveBeenCalledTimes(1);
    expect(spyFilterService).toHaveBeenCalledWith(
      filterSource.learningAreasWithInfo,
      {
        learningArea: { name: filterText }
      }
    );
  });

  it('should filter the learningAreas with case insensitivity', () => {
    const filterSource = learningAreasValue;

    // Enkel wiskunde
    const expectedOnlyWiskunde = [
      {
        learningArea: {
          name: 'Wiskunde',
          icon: 'wiskunde',
          color: '#2c354f'
        },
        openTasks: 2,
        closedTasks: 3
      }
    ];

    let filterText = '';
    let filteredResult = component.filterTextInput.filterFn(
      filterSource,
      filterText
    );
    expect(filteredResult).toEqual(learningAreasValue.learningAreasWithInfo);

    filterText = 'wISKUN';
    filteredResult = component.filterTextInput.filterFn(
      filterSource,
      filterText
    );
    expect(filteredResult).toEqual(expectedOnlyWiskunde);

    filterText = 'nothing nothing nothing';
    filteredResult = component.filterTextInput.filterFn(
      filterSource,
      filterText
    );
    expect(filteredResult).toEqual([]);
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
    expect(component.learningAreasWithInfo$).toBeObservable(
      hot('a', { a: learningAreasValue })
    );
  });

  it('should show the placeholder text when no learningAreas are available', () => {
    const placeholderText = 'Er zijn momenteel geen taken voor jou klaargezet.';

    learningAreas$.next({ learningAreasWithInfo: [], totalTasks: 0 });
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(
      By.css('.pages-tasks__container')
    );

    expect(componentDE.nativeElement.textContent).toContain(placeholderText);
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
    const amountOfClosedTasksText = '3 afgewerkte taken';

    const folderDE = fixture.debugElement.query(By.css('campus-folder'));

    expect(folderDE.nativeElement.textContent).toContain(amountOfOpenTasksText);
    expect(folderDE.nativeElement.textContent).toContain(
      amountOfClosedTasksText
    );
  });
});
