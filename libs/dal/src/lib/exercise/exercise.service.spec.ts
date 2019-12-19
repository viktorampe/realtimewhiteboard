import { inject, TestBed } from '@angular/core/testing';
import { EduContentApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { ScormCmiMode } from '../+external-interfaces/scorm-api.interface';
import { CurrentExerciseFixture, EduContentFixture } from '../+fixtures';
import { EduContent } from '../+models';
import { DalState } from '../+state';
import { CurrentExerciseInterface } from '../+state/current-exercise/current-exercise.reducer';
import { getStoreModuleForFeatures } from '../+state/dal.state.feature.builder';
import { EduContentActions, EduContentReducer } from '../+state/edu-content';
import { ContentRequestService } from '../content-request/content-request.service';
import { ResultsService } from '../results/results.service';
import { ResultsServiceInterface } from '../results/results.service.interface';
import { ResultFixture } from './../+fixtures/Result.fixture';
import { ExerciseService } from './exercise.service';
import { ExerciseServiceInterface } from './exercise.service.interface';

describe('ExerciseService', () => {
  let exerciseService: ExerciseServiceInterface;
  let resultsService: ResultsServiceInterface;
  let mockResult$: Observable<CurrentExerciseInterface>;
  let mockUrl$: Observable<any>;

  let mockData: {
    userId?: number;
    eduContentId?: number;
    saveToApi?: boolean;
    taskId?: number;
    unlockedContentId?: number;
    url?: string;
    cmiMode: ScormCmiMode.CMI_MODE_NORMAL;
    unlockedFreePracticeId?: number;
  };

  let mockExercise: CurrentExerciseInterface;
  let eduContents: EduContent[];
  let store: Store<DalState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
                StoreModule.forRoot({},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
        ...getStoreModuleForFeatures([EduContentReducer])
      ],
      providers: [
        ExerciseService,
        Store,
        {
          provide: ResultsService,
          useValue: {
            getResultForTask: () => mockResult$,
            getResultForUnlockedContent: () => mockResult$,
            getResultForUnlockedFreePractice: () => mockResult$,
            saveResult: () => mockResult$
          }
        },
        {
          provide: ContentRequestService,
          useValue: {
            requestUrl: () => mockUrl$
          }
        },
        {
          provide: PersonApi,
          useValue: {}
        },
        {
          provide: EduContentApi,
          useValue: {}
        }
      ]
    });

    exerciseService = TestBed.get(ExerciseService);
    resultsService = TestBed.get(ResultsService);
    store = TestBed.get(Store);
    setEduContentsState();

    mockData = {
      eduContentId: 1,
      taskId: 1,
      saveToApi: true,
      url: 'tempurl',
      cmiMode: ScormCmiMode.CMI_MODE_NORMAL
    };

    mockExercise = new CurrentExerciseFixture({
      eduContentId: 1,
      result: new ResultFixture({ cmi: "{ mode: 'normal' }" })
    });
  }),
    it('should be created and available via DI', inject(
      [ExerciseService],
      (service: ExerciseService) => {
        expect(service).toBeTruthy();
      }
    ));

  describe('startExercise', () => {
    it('should return an exercise for a task', () => {
      mockResult$ = hot('-a-|', {
        a: new ResultFixture({ cmi: "{ mode: 'normal' }" })
      });

      mockUrl$ = hot('-a-|', {
        a: mockData.url
      });

      expect(
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.cmiMode,
          mockData.taskId,
          null
        )
      ).toBeObservable(
        hot('-(a|)', {
          a: mockExercise
        })
      );
    });

    it('should return an exercise for an unlockedContent', () => {
      mockData = {
        userId: 6,
        eduContentId: 1,
        saveToApi: true,
        cmiMode: ScormCmiMode.CMI_MODE_NORMAL,
        unlockedContentId: 1,
        url: 'tempurl'
      };

      mockResult$ = hot('-a-|', {
        a: new ResultFixture({ cmi: "{ mode: 'normal' }" })
      });

      mockUrl$ = hot('-a-|', {
        a: mockData.url
      });

      expect(
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.cmiMode,
          null,
          mockData.unlockedContentId
        )
      ).toBeObservable(
        hot('-(a|)', {
          a: mockExercise
        })
      );
    });

    it('should return an exercise for an unlockedFreePractice', () => {
      mockData = {
        userId: 6,
        eduContentId: 1,
        saveToApi: true,
        cmiMode: ScormCmiMode.CMI_MODE_NORMAL,
        unlockedContentId: 1,
        url: 'tempurl',
        unlockedFreePracticeId: 1
      };

      mockResult$ = hot('-a-|', {
        a: new ResultFixture({ cmi: "{ mode: 'normal' }" })
      });

      mockUrl$ = hot('-a-|', {
        a: mockData.url
      });

      expect(
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.cmiMode,
          null,
          null,
          null,
          mockData.unlockedFreePracticeId
        )
      ).toBeObservable(
        hot('-(a|)', {
          a: mockExercise
        })
      );
    });

    it('should throw an error on invalid input', () => {
      mockData = {
        userId: 6,
        eduContentId: 1,
        saveToApi: true,
        cmiMode: ScormCmiMode.CMI_MODE_NORMAL,
        taskId: 1,
        unlockedContentId: 1,
        unlockedFreePracticeId: 1,
        url: 'tempurl'
      };

      mockResult$ = hot('-a-|', {
        a: new ResultFixture({ cmi: "{ mode: 'normal' }" })
      });

      mockUrl$ = hot('-a-|', {
        a: mockData.url
      });

      // no parameters
      expect(() =>
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          null,
          null
        )
      ).toThrowError(
        'Provide either a taskId, an unlockedContentId or an unlockedFreePracticeId'
      );

      // all parameters
      expect(() =>
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.cmiMode,
          mockData.taskId,
          mockData.unlockedContentId,
          null,
          mockData.unlockedFreePracticeId
        )
      ).toThrowError(
        'Provide either a taskId, an unlockedContentId or an unlockedFreePracticeId'
      );

      //task and freepractice
      expect(() =>
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.cmiMode,
          mockData.taskId,
          null,
          null,
          mockData.unlockedFreePracticeId
        )
      ).toThrowError(
        'Provide either a taskId, an unlockedContentId or an unlockedFreePracticeId'
      );

      //task and unlocked
      expect(() =>
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.cmiMode,
          mockData.taskId,
          mockData.unlockedContentId
        )
      ).toThrowError(
        'Provide either a taskId, an unlockedContentId or an unlockedFreePracticeId'
      );

      //unlocked and freepractice
      expect(() =>
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.cmiMode,
          null,
          mockData.unlockedContentId,
          null,
          mockData.unlockedFreePracticeId
        )
      ).toThrowError(
        'Provide either a taskId, an unlockedContentId or an unlockedFreePracticeId'
      );
    });

    it('should load a new exercice as review from result', () => {
      mockUrl$ = hot('-a-|', {
        a: mockData.url
      });

      expect(
        exerciseService.loadExercise(
          mockData.userId,
          mockData.eduContentId,
          false,
          ScormCmiMode.CMI_MODE_REVIEW,
          mockData.taskId,
          mockData.unlockedContentId,
          mockExercise.result
        )
      ).toBeObservable(
        hot('-a-|', {
          a: {
            ...mockExercise,
            cmiMode: ScormCmiMode.CMI_MODE_REVIEW,
            saveToApi: false
          }
        })
      );
    });
  });

  describe('saveExercise', () => {
    it('should save the result of an exercise through the resultsService', () => {
      jest.spyOn(resultsService, 'saveResult');

      mockResult$ = hot('-a-|', {
        a: new ResultFixture({ cmi: "{ mode: 'normal' }" })
      });

      const response = exerciseService.saveExercise(mockExercise);

      expect(resultsService.saveResult).toHaveBeenCalledWith(
        mockExercise.result.personId,
        mockExercise.result
      );

      expect(response).toBeObservable(
        hot('-a-|', {
          a: mockExercise
        })
      );
    });
  });

  function setEduContentsState() {
    eduContents = [
      new EduContentFixture({ id: 1 }),
      new EduContentFixture({ id: 2 }),
      new EduContentFixture({ id: 3 })
    ];
    store.dispatch(
      new EduContentActions.EduContentsLoaded({ eduContents: eduContents })
    );
  }
});
