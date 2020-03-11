import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentFixture,
  getRouterStateParams,
  ResultFixture
} from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { StudentTasksViewModel } from './student-tasks.viewmodel';

describe('KabasTaskViewModel', () => {
  const userId = 1;
  let studentTasksViewModel: StudentTasksViewModel;
  let store: MockStore<DalState>;
  let scormExerciseService: ScormExerciseServiceInterface;
  let openStaticContentService: OpenStaticContentServiceInterface;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
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
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(studentTasksViewModel).toBeDefined();
    });
  });

  describe('edu-content action handlers', () => {
    const mockEduContent = new EduContentFixture();
    const mockResult = new ResultFixture();
    const taskId = 5;

    beforeEach(() => {
      store.overrideSelector(getRouterStateParams, {
        task: taskId
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
