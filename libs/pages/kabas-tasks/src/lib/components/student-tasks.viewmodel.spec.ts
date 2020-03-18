// file.only

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentFixture,
  getRouterState,
  ResultFixture,
  TaskFixture
} from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { StudentTaskWithContentFixture } from '../interfaces/StudentTaskWithContent.fixture';
import { StudentTasksViewModel } from './student-tasks.viewmodel';
import * as vmSelectors from './student-tasks.viewmodel.selectors';
import { studentTaskWithContent } from './student-tasks.viewmodel.selectors';

describe('KabasTaskViewModel', () => {
  const userId = 1;
  let studentTasksViewModel: StudentTasksViewModel;
  let store: MockStore<DalState>;
  let scormExerciseService: ScormExerciseServiceInterface;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        StudentTasksViewModel,
        provideMockStore(),
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId } },
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useValue: {
            startExerciseFromTask: jest.fn(),
            reviewExerciseFromResult: jest.fn()
          }
        },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: {
            open: jest.fn()
          }
        }
      ]
    });
  });

  beforeEach(() => {
    studentTasksViewModel = TestBed.get(StudentTasksViewModel);
    store = TestBed.get(Store);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    router = TestBed.get(Router);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(studentTasksViewModel).toBeDefined();
    });
  });

  describe('open task action handlers', () => {
    it('openTask() should navigate to the task detail', () => {
      const mockTask = new TaskFixture({ id: 666 });
      const spy = jest.spyOn(router, 'navigate');

      studentTasksViewModel.openTask(mockTask);
      expect(spy).toHaveBeenCalledWith(['tasks', 666]);
    });
  });

  describe('presentation streams', () => {
    describe('currentTask$', () => {
      const mockTask = new StudentTaskWithContentFixture();

      beforeEach(() => {
        store.overrideSelector(getRouterState, {
          navigationId: 1,
          state: {
            url: '',
            params: {
              id: '1'
            },
            queryParams: {}
          }
        });

        store.overrideSelector(studentTaskWithContent, mockTask);
        jest.spyOn(vmSelectors, 'studentTaskWithContent');
      });

      it('should return the current task based on the route task id', () => {
        expect(studentTasksViewModel.currentTask$).toBeObservable(
          hot('a', {
            a: mockTask
          })
        );

        expect(vmSelectors.studentTaskWithContent).toHaveBeenCalledWith(
          {},
          { id: 1 }
        );
      });
    });
  });

  describe('edu-content action handlers', () => {
    const mockEduContent = new EduContentFixture();
    const mockResult = new ResultFixture();
    const taskId = 5;

    beforeEach(() => {
      store.overrideSelector(getRouterState, {
        navigationId: 1,
        state: {
          url: '',
          params: {
            id: '5'
          },
          queryParams: {}
        }
      });
    });

    describe('openEduContentAsExercise', () => {
      it('should call scormExerciseService.openEduContentAsExercise()', () => {
        studentTasksViewModel.openEduContentAsExercise(mockEduContent);
        expect(scormExerciseService.startExerciseFromTask).toHaveBeenCalledWith(
          userId,
          mockEduContent.id,
          taskId
        );
      });
    });

    describe('openEduContentAsSolution', () => {
      it('should throw error', () => {
        expect(() =>
          studentTasksViewModel.openEduContentAsSolution(mockEduContent)
        ).toThrowError(`students can't open with solution in task`);
      });
    });

    describe('openEduContentFromResult', () => {
      it('should call scormExerciseService.reviewExerciseFromResult()', () => {
        studentTasksViewModel.openEduContentFromResult(mockResult);
        expect(
          scormExerciseService.reviewExerciseFromResult
        ).toHaveBeenCalledWith(mockResult);
      });
    });

    describe('openEduContentAsStream', () => {
      it('should call openStaticContentService.open()', () => {
        studentTasksViewModel.openEduContentAsStream(mockEduContent);
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          mockEduContent,
          true
        );
      });
    });

    describe('openEduContentAsDownload', () => {
      it('should call openStaticContentService.open()', () => {
        studentTasksViewModel.openEduContentAsDownload(mockEduContent);
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          mockEduContent,
          false
        );
      });
    });

    describe('openBoeke', () => {
      it('should call openStaticContentService.open()', () => {
        studentTasksViewModel.openBoeke(mockEduContent);
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          mockEduContent
        );
      });
    });

    describe('previewEduContentAsImage', () => {
      it('should call openStaticContentService.open()', () => {
        studentTasksViewModel.previewEduContentAsImage(mockEduContent);
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          mockEduContent,
          false,
          true
        );
      });
    });
  });
});
