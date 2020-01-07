import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  LearningAreaInterface,
  TaskEduContentFixture,
  TaskEduContentInterface
} from '@campus/dal';
import { MockActivatedRoute, MockMatIconRegistry } from '@campus/testing';
import { ListFormat, ListViewItemDirective, UiModule } from '@campus/ui';
import { FilterService, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { hot } from '@nrwl/angular/testing';
import { BehaviorSubject, of } from 'rxjs';
import { TasksViewModel } from '../tasks.viewmodel';
import { TaskWithInfoInterface } from '../tasks.viewmodel.interfaces';
import { MockTasksViewModel } from '../tasks.viewmodel.mock';
import { TaskDetailComponent } from './task-detail.component';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let tasksViewModel: TasksViewModel;
  let learningArea$: BehaviorSubject<LearningAreaInterface>;
  let taskInfo$: BehaviorSubject<TaskWithInfoInterface>;
  let listFormat$: BehaviorSubject<ListFormat>;
  let activatedRoute: MockActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, BrowserAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TaskDetailComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
        { provide: TasksViewModel, useClass: MockTasksViewModel },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    tasksViewModel = TestBed.get(TasksViewModel);
    activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.params.next({ area: 1, task: 1 });
    fixture.detectChanges();

    learningArea$ = tasksViewModel.getLearningAreaById(1) as BehaviorSubject<
      LearningAreaInterface
    >;
    taskInfo$ = tasksViewModel.getTaskWithInfo(1) as BehaviorSubject<
      TaskWithInfoInterface
    >;
    listFormat$ = tasksViewModel.listFormat$ as BehaviorSubject<ListFormat>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error message if a task is no longer available', () => {
    component.taskInfo$ = of(null);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('campus-side-sheet'))).toBeFalsy();
    expect(fixture.debugElement.nativeElement.textContent).toContain(
      'Deze taak is niet langer beschikbaar'
    );
  });

  it('should call the filter service when filterTextInput.filterFn is called, and display the correct content', () => {
    const filterText = '';
    component.filterTextInput.setFilterableItem(component);

    const spyFilterService = jest.spyOn(component, 'filterFn');
    component.filterTextInput.setValue(filterText);

    expect(spyFilterService).toHaveBeenCalledTimes(1);

    fixture.detectChanges();
    const componentDE = fixture.debugElement.query(By.css('.itemsAmount'));
    expect(componentDE.nativeElement.textContent).toContain('4 van 4');
    const listview = fixture.debugElement.query(By.css('campus-list-view'));
    expect(listview.childNodes.length).toBe(4);

    component.filterTextInput.setValue('a');
    fixture.detectChanges();
    expect(componentDE.nativeElement.textContent).toContain('1 van 4');
    expect(listview.children.length).toBe(1);
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

  it('should get the listFormat$, learningArea$, taskInfo$ and from the tasksViewModel', () => {
    expect(component.listFormat$).toBeObservable(
      hot('a', { a: listFormat$.value })
    );
    expect(component.learningArea$).toBeObservable(
      hot('a', { a: learningArea$.value })
    );
    expect(component.taskInfo$).toBeObservable(
      hot('a', { a: taskInfo$.value })
    );
  });

  it('should show the teacher info in the infopanel if no item is selected', () => {
    component.list.deselectAllItems();
    fixture.detectChanges();

    expect(component.list.selectedItems$.value.length).toBe(0);

    const infoPanelDE = fixture.debugElement.query(
      By.css('campus-side-sheet-body')
    );
    const infoPanelBundle = infoPanelDE.query(By.css('campus-info-panel-task'));
    const infoPanelContent = infoPanelDE.query(
      By.css('campus-info-panel-content')
    );
    expect(infoPanelBundle).toBeTruthy();
    expect(infoPanelContent).toBeFalsy();
  });

  it('should show the item info in the infopanel if an item is selected', () => {
    component.list.deselectAllItems();
    const listDE = fixture.debugElement.query(By.css('campus-list-view'));
    const listItems = listDE.queryAll(By.directive(ListViewItemDirective));
    listItems[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.list.selectedItems$.value.length).toBe(1);

    const infoPanelDE = fixture.debugElement.query(
      By.css('campus-side-sheet-body')
    );
    const infoPanelBundle = infoPanelDE.query(
      By.css('campus-info-panel-bundle')
    );
    const infoPanelContent = infoPanelDE.query(
      By.css('campus-info-panel-content')
    );
    const infoPanelContents = infoPanelDE.query(
      By.css('campus-info-panel-contents')
    );
    expect(infoPanelBundle).toBeFalsy();
    expect(infoPanelContent).toBeTruthy();
    expect(infoPanelContents).toBeFalsy();
  });

  it('should mark the alerts about the task as read', () => {
    tasksViewModel.setTaskAlertRead = jest.fn();

    component.ngOnInit();

    expect(tasksViewModel.setTaskAlertRead).toHaveBeenCalled();
    expect(tasksViewModel.setTaskAlertRead).toHaveBeenCalledWith(1);
  });

  it('should add the task to history', () => {
    tasksViewModel.setTaskHistory = jest.fn();

    component.ngOnInit();

    expect(tasksViewModel.setTaskHistory).toHaveBeenCalled();
    expect(tasksViewModel.setTaskHistory).toHaveBeenCalledWith(1);
  });

  it('should open an exercise', () => {
    tasksViewModel.startExercise = jest.fn();
    const mockTaskEduContent: TaskEduContentInterface = new TaskEduContentFixture(
      { eduContentId: 123, taskId: 456 }
    );

    component.clickOpenContent(mockTaskEduContent);

    expect(tasksViewModel.startExercise).toHaveBeenCalled();
    expect(tasksViewModel.startExercise).toHaveBeenCalledWith(
      mockTaskEduContent
    );
  });
});
