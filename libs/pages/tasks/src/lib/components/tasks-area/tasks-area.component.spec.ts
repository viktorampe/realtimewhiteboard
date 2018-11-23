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

    learningAreas$ = tasksViewModel.learningAreasWithTaskInstanceInfo$ as BehaviorSubject<
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

  it('should call the filter service when filterTextInput.filterFn is called, and display the correct count/learning areas', () => {
    const filterSource = {
      learningAreasWithInfo: []
    } as LearningAreasWithTaskInstanceInfoInterface;
    const filterText = '';
    component.filterTextInput.setFilterableItem(component);

    const spyFilterService = jest.spyOn(component, 'filterFn');
    component.filterTextInput.setValue(filterText);

    expect(spyFilterService).toHaveBeenCalledTimes(1);
    expect(spyFilterService).toHaveBeenCalledWith(
      {
        learningAreasWithInfo: [
          {
            closedTasks: 3,
            learningArea: {
              color: '#2c354f',
              icon: 'wiskunde',
              name: 'Wiskunde'
            },
            openTasks: 2
          },
          {
            closedTasks: 2,
            learningArea: {
              color: '#5e3b47',
              icon: 'natuurwetenschappen',
              name: 'Moderne Wetenschappen'
            },
            openTasks: 0
          },
          {
            closedTasks: 0,
            learningArea: { color: '#553030', icon: 'engels', name: 'Engels' },
            openTasks: 2
          }
        ],
        totalTasks: 9
      },
      ''
    );

    fixture.detectChanges();
    const componentDE = fixture.debugElement.query(
      By.css('.pages-tasks__container')
    );
    expect(componentDE.nativeElement.textContent).toContain('3 van 3');
    const tasksArea = fixture.debugElement.query(
      By.css('.pages-tasks__container__learning-areas')
    );
    expect(tasksArea.children[0].children[0].children.length).toBe(3);

    component.filterTextInput.setValue('a');
    fixture.detectChanges();
    expect(componentDE.nativeElement.textContent).toContain('1 van 3');
    expect(tasksArea.children[0].children[0].children.length).toBe(1);
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

    component.filterTextInput.setFilterableItem(component);

    let filteredResult = component.filterFn(filterSource, filterText);
    expect(filteredResult).toEqual(learningAreasValue.learningAreasWithInfo);

    filterText = 'wISKUN';
    filteredResult = component.filterFn(filterSource, filterText);
    expect(filteredResult).toEqual(expectedOnlyWiskunde);

    filterText = 'nothing nothing nothing';
    filteredResult = component.filterFn(filterSource, filterText);
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
