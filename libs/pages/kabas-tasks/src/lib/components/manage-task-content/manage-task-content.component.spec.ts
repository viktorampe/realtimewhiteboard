import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskEduContentFixture, TaskWithAssigneesInterface } from '@campus/dal';
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
import { BehaviorSubject } from 'rxjs';
import { TaskEduContentWithEduContentInterface } from '../../interfaces/TaskEduContentWithEduContent.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { ManageTaskContentComponent } from './manage-task-content.component';

describe('ManageTaskContentComponent', () => {
  let component: ManageTaskContentComponent;
  let fixture: ComponentFixture<ManageTaskContentComponent>;
  let router: Router;

  let searchComponent;
  let viewModel: MockKabasTasksViewModel;

  let currentTask: TaskWithAssigneesInterface;
  let restOfTasks: TaskWithAssigneesInterface[];
  let taskEduContents: TaskEduContentWithEduContentInterface[];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        NoopAnimationsModule,
        SearchTestModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [ManageTaskContentComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} },
        {
          provide: Router,
          useValue: {
            navigate: () => {},
            url: '/foo'
          }
        }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });
    router = TestBed.get(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTaskContentComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(KabasTasksViewModel);
    router = TestBed.get(Router);

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

  describe('navigation', () => {
    it('should show the toc navigation links', done => {
      const lessonLinkDEs = fixture.debugElement.queryAll(
        By.css('.manage-task-content__lesson-link')
      );

      viewModel.currentToc$.subscribe(tocs => {
        lessonLinkDEs.forEach((lessonLinkDE, index) => {
          const toc = tocs[index];

          expect(lessonLinkDE.nativeElement.textContent).toBe(toc.title);

          const clickSelectToc = jest
            .spyOn(component, 'selectTOC')
            .mockImplementation();

          lessonLinkDE.nativeElement.click();

          expect(clickSelectToc).toHaveBeenCalled();
          expect(clickSelectToc).toHaveBeenCalledWith(toc.id, toc.depth);
        });

        done();
      });
    });
  });

  describe('favorite book redirect', () => {
    it('should navigate to favorite book when one favorite is found', async () => {
      jest.spyOn(router, 'navigate');
      component.ngOnInit();

      expect(router.navigate).toHaveBeenCalledWith(['/foo'], {
        queryParams: { book: 1 }
      });
    });

    it('should not navigate when no favorite is found', async () => {
      jest.spyOn(router, 'navigate');
      (viewModel.favoriteBookIdsForTask$ as BehaviorSubject<number[]>).next([]);
      component.ngOnInit();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when multiple favorites are found', () => {
      jest.spyOn(router, 'navigate');
      (viewModel.favoriteBookIdsForTask$ as BehaviorSubject<number[]>).next([
        1,
        2
      ]);
      component.ngOnInit();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when already in a book', () => {
      jest.spyOn(router, 'navigate');
      (viewModel.currentTaskParams$ as BehaviorSubject<Params>).next({
        book: 5
      });
      component.ngOnInit();

      expect(router.navigate).not.toHaveBeenCalled();
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

      it('should not call updateTaskEduContentsOrder when the order did not actually change', () => {
        jest.spyOn(viewModel, 'updateTaskEduContentsOrder');

        const event = { previousIndex: 1, currentIndex: 1 } as CdkDragDrop<
          TaskEduContentWithEduContentInterface[]
        >;

        component.dropTaskEduContent(taskEduContents, event);

        expect(viewModel.updateTaskEduContentsOrder).not.toHaveBeenCalled();
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

  describe('selectTOC', () => {
    it('should navigate to the lesson when clickOpenToc is called', () => {
      jest.spyOn(router, 'navigate');
      component.selectTOC(1, 0);
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { chapter: 1 },
        queryParamsHandling: 'merge'
      });
    });

    it('should navigate to the chapter when clickOpenToc is called', () => {
      jest.spyOn(router, 'navigate');
      component.selectTOC(2, 1);
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { lesson: 2 },
        queryParamsHandling: 'merge'
      });
    });
  });

  describe('clickDone', () => {
    it('should navigate to the task detail when clickDone is called', () => {
      jest.spyOn(router, 'navigate');
      component.clickDone();
      expect(router.navigate).toHaveBeenCalledWith([
        'tasks',
        'manage',
        currentTask.id
      ]);
    });
  });
});
