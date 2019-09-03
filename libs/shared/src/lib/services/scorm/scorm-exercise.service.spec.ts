import { fakeAsync, TestBed } from '@angular/core/testing';
import { WINDOW_SERVICE_TOKEN } from '@campus/browser';
import {
  CurrentExerciseActions,
  CurrentExerciseReducer,
  ResultFixture
} from '@campus/dal';
import {
  ScormApiService,
  ScormCmiMode,
  SCORM_API_SERVICE_TOKEN
} from '@campus/scorm';
import { Store, StoreModule } from '@ngrx/store';
import { ScormExerciseService } from './scorm-exercise.service';
import { SCORM_EXERCISE_SERVICE_TOKEN } from './scorm-exercise.service.interface';

describe('ScormExerciseService', () => {
  let scormExerciseService: ScormExerciseService;
  let scormApiService: ScormApiService;
  const openWindow = jest.fn();
  const closeWindow = jest.fn();
  let store: Store<CurrentExerciseReducer.State>;
  let usedState;

  beforeAll(() => {
    usedState = {
      ...CurrentExerciseReducer.initialState,
      url: {
        url: 'http://google.com'
      }
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          CurrentExerciseReducer.NAME,
          CurrentExerciseReducer.reducer,
          {
            initialState: usedState
          }
        )
      ],
      providers: [
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useClass: ScormExerciseService
        },
        { provide: SCORM_API_SERVICE_TOKEN, useClass: ScormApiService },
        {
          provide: WINDOW_SERVICE_TOKEN,
          useValue: {
            openWindow,
            closeWindow
          }
        },
        Store
      ]
    });
    scormExerciseService = TestBed.get(ScormExerciseService);
    scormApiService = TestBed.get(ScormApiService);

    store = TestBed.get(Store);
    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(scormExerciseService).toBeTruthy();
    expect(scormApiService).toBeTruthy();
    expect(store).toBeTruthy();
  });

  it('should start a preview from unlockedcontent with answers', () => {
    scormExerciseService.previewExerciseFromUnlockedContent(1, 2, 3, true);
    expect(store.dispatch).toHaveBeenCalledWith(
      new CurrentExerciseActions.LoadExercise({
        userId: 1,
        educontentId: 2,
        unlockedContentId: 3,
        saveToApi: false,
        cmiMode: ScormCmiMode.CMI_MODE_PREVIEW,
        taskId: null
      })
    );
  });

  it('should start a preview from task with answers', () => {
    scormExerciseService.previewExerciseFromTask(1, 2, 3, true);
    expect(store.dispatch).toHaveBeenCalledWith(
      new CurrentExerciseActions.LoadExercise({
        userId: 1,
        educontentId: 2,
        unlockedContentId: null,
        saveToApi: false,
        cmiMode: ScormCmiMode.CMI_MODE_PREVIEW,
        taskId: 3
      })
    );
  });

  it('should start a preview from unlockedcontent without answers', () => {
    scormExerciseService.previewExerciseFromUnlockedContent(1, 2, 3, false);
    expect(store.dispatch).toHaveBeenCalledWith(
      new CurrentExerciseActions.LoadExercise({
        userId: 1,
        educontentId: 2,
        unlockedContentId: 3,
        saveToApi: false,
        cmiMode: ScormCmiMode.CMI_MODE_NORMAL,
        taskId: null
      })
    );
  });

  it('should start an preview task without answers ', () => {
    scormExerciseService.previewExerciseFromTask(1, 2, 3, false);
    expect(store.dispatch).toHaveBeenCalledWith(
      new CurrentExerciseActions.LoadExercise({
        userId: 1,
        educontentId: 2,
        unlockedContentId: null,
        saveToApi: false,
        cmiMode: ScormCmiMode.CMI_MODE_NORMAL,
        taskId: 3
      })
    );
  });

  it('should start a exercise as review ', () => {
    const res = new ResultFixture({
      id: 10,
      personId: 1,
      eduContentId: 2,
      taskId: 3,
      bundleId: null,
      unlockedContentId: null
    });
    scormExerciseService.reviewExerciseFromResult(res);
    expect(store.dispatch).toHaveBeenCalledWith(
      new CurrentExerciseActions.LoadExercise({
        userId: 1,
        educontentId: 2,
        unlockedContentId: null,
        saveToApi: false,
        cmiMode: ScormCmiMode.CMI_MODE_REVIEW,
        taskId: 3,
        result: res
      })
    );
  });

  it('should start a exercise as task', () => {
    scormExerciseService.startExerciseFromTask(1, 2, 3);
    expect(store.dispatch).toHaveBeenCalledWith(
      new CurrentExerciseActions.LoadExercise({
        userId: 1,
        educontentId: 2,
        unlockedContentId: null,
        saveToApi: true,
        cmiMode: ScormCmiMode.CMI_MODE_BROWSE,
        taskId: 3
      })
    );
  });

  it('should start a exercise', () => {
    scormExerciseService.startExerciseFromUnlockedContent(1, 2, 3);
    expect(store.dispatch).toHaveBeenCalledWith(
      new CurrentExerciseActions.LoadExercise({
        userId: 1,
        educontentId: 2,
        unlockedContentId: 3,
        saveToApi: true,
        cmiMode: ScormCmiMode.CMI_MODE_NORMAL,
        taskId: null
      })
    );
  });

  it('should close the window and dispatch clear', fakeAsync(() => {
    scormExerciseService.closeExercise();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should get the current URL', () => {
    store.dispatch(
      new CurrentExerciseActions.CurrentExerciseLoaded({
        cmiMode: ScormCmiMode.CMI_MODE_BROWSE,
        url: 'lalalala',
        saveToApi: false,
        eduContentId: 1,
        result: new ResultFixture()
      })
    );
    expect(openWindow).toHaveBeenCalledWith('scorm', 'lalalala', true);
  });
});
