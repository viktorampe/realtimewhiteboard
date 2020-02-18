import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskEduContentFixture } from '@campus/dal';
import {
  ResultItemMockComponent,
  SearchComponent,
  SearchStateInterface,
  SearchTestModule
} from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { TaskEduContentWithEduContentInterface } from '../../interfaces/TaskEduContentWithEduContent.interface';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { ManageTaskContentComponent } from './manage-task-content.component';

describe('ManageTaskContentComponent', () => {
  let component: ManageTaskContentComponent;
  let fixture: ComponentFixture<ManageTaskContentComponent>;

  let searchComponent;
  let viewModel: MockKabasTasksViewModel;

  let currentTask: TaskWithAssigneesInterface;
  let restOfTasks: TaskWithAssigneesInterface[];
  let taskEduContents: TaskEduContentWithEduContentInterface[];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule, SearchTestModule, SharedModule],
      declarations: [ManageTaskContentComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTaskContentComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(KabasTasksViewModel);

    searchComponent = TestBed.get(SearchComponent);
    component.searchComponent = searchComponent;

    [currentTask, ...restOfTasks] = viewModel.tasksWithAssignments$.value;
    taskEduContents = currentTask.taskEduContents;

    fixture.detectChanges();
  });

  function updateCurrentTask(taskUpdate: Partial<TaskWithAssigneesInterface>) {
    viewModel.tasksWithAssignments$.next([
      {
        ...currentTask,
        ...taskUpdate
      },
      ...restOfTasks
    ]);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    let mockSearchState;

    beforeEach(() => {
      mockSearchState = {
        searchTerm: 'breuken'
      } as SearchStateInterface;
    });

    it('should reset search filters when clearSearchFilters is called', () => {
      component.searchComponent.reset = jest.fn();
      component.clearSearchFilters();

      expect(component.searchComponent.reset).toHaveBeenCalledTimes(1);
    });

    it('should send searchText to viewmodel subject', () => {
      jest.spyOn(viewModel, 'requestAutoComplete');

      component.onAutoCompleteRequest('foo');

      expect(viewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
      expect(viewModel.requestAutoComplete).toHaveBeenCalledWith('foo');
    });

    it('should send searchstate to viewmodel on change', () => {
      jest.spyOn(viewModel, 'updateSearchState');

      component.onSearchStateChange(mockSearchState);

      expect(viewModel.updateSearchState).toHaveBeenCalledTimes(1);
      expect(viewModel.updateSearchState).toHaveBeenCalledWith(mockSearchState);
    });
  });

  describe('sidepanel', () => {
    describe('reordering', () => {
      it('should call updateTaskEduContentsOrder with the newly ordered items when dropping', () => {
        jest.spyOn(viewModel, 'updateTaskEduContentsOrder');

        const event = { previousIndex: 2, currentIndex: 1 } as CdkDragDrop<
          TaskEduContentWithEduContentInterface[]
        >;

        const expected = [
          taskEduContents[0],
          taskEduContents[2],
          taskEduContents[1]
        ];

        component.dropTaskEduContent(taskEduContents, event);

        expect(viewModel.updateTaskEduContentsOrder).toHaveBeenCalledWith(
          expected
        );
      });

      it('should update reorderableTaskEduContents$ with the updated taskEduContents when task updates', () => {
        const newTaskEduContents = [new TaskEduContentFixture({ id: 7 })];

        updateCurrentTask({
          taskEduContents: newTaskEduContents
        });

        expect(component.reorderableTaskEduContents$).toBeObservable(
          hot('a', {
            a: newTaskEduContents
          })
        );
      });
    });
  });
});
