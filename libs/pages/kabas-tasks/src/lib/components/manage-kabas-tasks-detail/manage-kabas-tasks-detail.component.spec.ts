import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MatIconRegistry,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  EduContentFixture,
  LearningAreaFixture,
  LearningAreaInterface
} from '@campus/dal';
import { SearchModule } from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { ConfirmationModalComponent, UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, of } from 'rxjs';
import { AssigneeFixture } from '../../interfaces/Assignee.fixture';
import {
  CurrentTaskParams,
  KabasTasksViewModel
} from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import {
  NewTaskComponent,
  NewTaskFormValues
} from '../new-task/new-task.component';
import { ManageKabasTasksDetailComponent } from './manage-kabas-tasks-detail.component';

describe('ManageKabasTasksDetailComponent', () => {
  let component: ManageKabasTasksDetailComponent;
  let fixture: ComponentFixture<ManageKabasTasksDetailComponent>;
  let viewModel: MockKabasTasksViewModel;
  let matDialog: MatDialog;
  let router: Router;
  const queryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>({});

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        MatSlideToggleModule,
        MatSelectModule,
        SearchModule,
        UiModule,
        NoopAnimationsModule,
        MatRadioModule,
        RouterTestingModule
      ],
      declarations: [ManageKabasTasksDetailComponent],
      providers: [
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: () => of('test')
            })
          }
        },
        { provide: Router, useValue: { navigate: () => {} } },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams,
            snapshot: { queryParams: queryParams.getValue() }
          }
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
  });

  beforeEach(() => {
    viewModel = TestBed.get(KabasTasksViewModel);
    matDialog = TestBed.get(MatDialog);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(ManageKabasTasksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('task assignee modal', () => {
    // TODO
  });

  describe('isNewTask$', () => {
    it('should be true if currentTaskParams does not have a task id', () => {
      (viewModel.currentTaskParams$ as BehaviorSubject<CurrentTaskParams>).next(
        {
          id: undefined
        }
      );

      expect(component.isNewTask$).toBeObservable(
        hot('a', {
          a: true
        })
      );
    });

    it('should be false if currentTaskParams has a task id', () => {
      (viewModel.currentTaskParams$ as BehaviorSubject<CurrentTaskParams>).next(
        {
          id: 1
        }
      );

      expect(component.isNewTask$).toBeObservable(
        hot('a', {
          a: false
        })
      );
    });

    it('should call openNewTaskDialog when there is a new task', () => {
      jest.spyOn(component, 'openNewTaskDialog');

      (viewModel.currentTaskParams$ as BehaviorSubject<CurrentTaskParams>).next(
        {
          id: undefined
        }
      );
      component.ngOnInit();

      expect(component.openNewTaskDialog).toHaveBeenCalled();
    });

    it('should not call openNewTaskDialog when we are in an existing task', () => {
      jest.spyOn(component, 'openNewTaskDialog');

      (viewModel.currentTaskParams$ as BehaviorSubject<CurrentTaskParams>).next(
        {
          id: 1
        }
      );
      component.ngOnInit();

      expect(component.openNewTaskDialog).not.toHaveBeenCalled();
    });
  });

  describe('clickDeleteTask()', () => {
    let openDialogSpy: jest.SpyInstance;
    const taskToDelete = {
      id: 1,
      name: 'test',
      eduContentAmount: 0,
      assignees: [new AssigneeFixture()]
    };

    beforeEach(() => {
      openDialogSpy = jest.spyOn(matDialog, 'open');
    });

    it('should open a confirmation dialog', () => {
      const mockDialogRef = {
        afterClosed: () => of(false),
        close: null
      } as MatDialogRef<ConfirmationModalComponent>;
      openDialogSpy.mockReturnValue(mockDialogRef);

      component.clickDeleteTask(taskToDelete);

      expect(openDialogSpy).toHaveBeenCalledTimes(1);
      expect(openDialogSpy).toHaveBeenCalledWith(ConfirmationModalComponent, {
        data: {
          title: 'Taak verwijderen',
          message: 'Ben je zeker dat je de geselecteerde taak wil verwijderen?'
        }
      });
    });

    it('should call vm.removeTasks when the user confirms', () => {
      const removeTaskSpy = jest.spyOn(viewModel, 'removeTasks');

      const mockDialogRef = {
        afterClosed: () => of(true), // fake confirmation
        close: null
      } as MatDialogRef<ConfirmationModalComponent>;
      openDialogSpy.mockReturnValue(mockDialogRef);

      component.clickDeleteTask(taskToDelete);

      expect(removeTaskSpy).toHaveBeenCalledTimes(1);
      expect(removeTaskSpy).toHaveBeenCalledWith([taskToDelete], true);
    });

    it('should not call vm.removeTasks when the user cancels', () => {
      const removeTaskSpy = jest.spyOn(viewModel, 'removeTasks');

      const mockDialogRef = {
        afterClosed: () => of(false), // fake cancel
        close: null
      } as MatDialogRef<ConfirmationModalComponent>;
      openDialogSpy.mockReturnValue(mockDialogRef);

      component.clickDeleteTask(taskToDelete);

      expect(removeTaskSpy).not.toHaveBeenCalled();
    });
  });

  describe('openNewTaskDialog()', () => {
    const afterClosed: BehaviorSubject<any> = new BehaviorSubject(null);
    const mockFormData: NewTaskFormValues = {
      title: 'Abc',
      learningArea: new LearningAreaFixture(),
      type: 'digital'
    };

    beforeEach(() => {
      jest.spyOn(matDialog, 'open').mockImplementation(() => {
        return {
          afterClosed: () => afterClosed
        } as any;
      });
    });

    it('should open a MatDialog with the correct data', () => {
      const allowedLearningAreas = [
        new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
        new LearningAreaFixture({ id: 2, name: 'frans' })
      ];
      (viewModel.selectableLearningAreas$ as BehaviorSubject<
        LearningAreaInterface[]
      >).next(allowedLearningAreas);

      component.openNewTaskDialog();

      expect(matDialog.open).toHaveBeenCalledWith(NewTaskComponent, {
        data: {
          learningAreas: allowedLearningAreas
        },
        panelClass: 'pages-kabas-tasks-new-task__dialog'
      });
    });

    it('should navigate back to the overview if there is no formData in the dialog result', fakeAsync(() => {
      jest.spyOn(router, 'navigate');

      afterClosed.next(null);
      component.openNewTaskDialog();

      expect(router.navigate).toHaveBeenCalledWith(['tasks', 'manage'], {
        queryParams: { tab: 0 }
      });
    }));

    it('should pass new task data to the viewmodel if there was formData in the dialog result', () => {
      jest.spyOn(viewModel, 'createTask');

      afterClosed.next(mockFormData);
      component.openNewTaskDialog();

      expect(viewModel.createTask).toHaveBeenCalledWith(
        mockFormData.title,
        mockFormData.learningArea.id,
        mockFormData.type
      );
    });
  });

  describe('sidepanel content', () => {
    it('should show the task info in the sidepanel when selection is empty', () => {
      component.selectedContents$.next([]);
      fixture.detectChanges();

      const taskInfoDE = fixture.debugElement.query(
        By.css('[data-cy="task-title"]')
      );
      const eduContentInfoDE = fixture.debugElement.queryAll(
        By.css('[data-cy="educontent-detail"]')
      );

      expect(taskInfoDE).toBeTruthy();
      expect(eduContentInfoDE.length).toBe(0);
    });

    it('should show the educontent info in the sidepanel when there is a selection', () => {
      component.selectedContents$.next([
        new EduContentFixture(),
        new EduContentFixture()
      ]);
      fixture.detectChanges();

      const taskInfoDE = fixture.debugElement.query(
        By.css('[data-cy="task-title"]')
      );
      const eduContentInfoDE = fixture.debugElement.queryAll(
        By.css('[data-cy="educontent-detail"]')
      );

      expect(taskInfoDE).toBeFalsy();
      expect(eduContentInfoDE.length).toBe(2);
    });
  });

  describe('update actions', () => {
    it('should update title when text changed', () => {
      const titleComponent = fixture.debugElement.query(
        By.css('.manage-kabas-tasks-detail__info__title')
      );

      const newText = 'You are more than who you were';

      spyOn(component, 'updateTitle');
      titleComponent.componentInstance.textChanged.emit(newText);

      expect(component.updateTitle).toHaveBeenCalled();
      expect(component.updateTitle).toHaveBeenCalledWith(
        titleComponent.componentInstance.relatedItem,
        newText
      );
    });

    it('should update description when text changed', () => {
      const descriptionComponent = fixture.debugElement.query(
        By.css('.manage-kabas-tasks-detail__info__description')
      );

      const newText = "Time isn't the main thing. It's the only thing.";

      spyOn(component, 'updateDescription');

      descriptionComponent.componentInstance.textChanged.emit(newText);

      expect(component.updateDescription).toHaveBeenCalled();
      expect(component.updateDescription).toHaveBeenCalledWith(
        descriptionComponent.componentInstance.relatedItem,
        newText
      );
    });
  });
});
