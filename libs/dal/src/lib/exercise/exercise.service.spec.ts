import { inject, TestBed } from '@angular/core/testing';
import { EduContentApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { CurrentExerciseFixture } from '../+fixtures';
import { CurrentExerciseInterface } from '../+state/current-exercise/current-exercise.reducer';
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
  };

  let mockExercise: CurrentExerciseInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExerciseService,
        {
          provide: ResultsService,
          useValue: {
            getResultForTask: () => mockResult$,
            getResultForUnlockedContent: () => mockResult$,
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

    mockData = {
      eduContentId: 1,
      taskId: 1,
      saveToApi: true,
      url: 'tempurl'
    };

    mockExercise = new CurrentExerciseFixture({
      result: new ResultFixture({ cmi: { mode: 'normal' } })
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
        a: new ResultFixture({ cmi: { mode: 'normal' } })
      });

      mockUrl$ = hot('-a-|', {
        a: mockData.url
      });

      expect(
        exerciseService.startExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.taskId,
          null
        )
      ).toBeObservable(
        hot('-a-|', {
          a: mockExercise
        })
      );
    });

    it('should return an exercise for an unlockedContent', () => {
      mockData = {
        userId: 6,
        eduContentId: 1,
        saveToApi: true,
        unlockedContentId: 1,
        url: 'tempurl'
      };

      mockResult$ = hot('-a-|', {
        a: new ResultFixture({ cmi: { mode: 'normal' } })
      });

      mockUrl$ = hot('-a-|', {
        a: mockData.url
      });

      expect(
        exerciseService.startExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          null,
          mockData.unlockedContentId
        )
      ).toBeObservable(
        hot('-a-|', {
          a: mockExercise
        })
      );
    });

    it('should throw an error on invalid input', () => {
      mockData = {
        userId: 6,
        eduContentId: 1,
        saveToApi: true,
        taskId: 1,
        unlockedContentId: 1,
        url: 'tempurl'
      };

      mockResult$ = hot('-a-|', {
        a: new ResultFixture({ cmi: { mode: 'normal' } })
      });

      mockUrl$ = hot('-a-|', {
        a: mockData.url
      });

      // no parameters
      expect(() =>
        exerciseService.startExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          null,
          null
        )
      ).toThrowError('Provide either a taskId or an unlockedContentId');

      // both parameters
      expect(() =>
        exerciseService.startExercise(
          mockData.userId,
          mockData.eduContentId,
          mockData.saveToApi,
          mockData.taskId,
          mockData.unlockedContentId
        )
      ).toThrowError('Provide either a taskId or an unlockedContentId');
    });
  });

  describe('saveExercise', () => {
    it('should save the result of an exercise through the resultsService', () => {
      jest.spyOn(resultsService, 'saveResult');

      mockResult$ = hot('-a-|', {
        a: new ResultFixture({ cmi: { mode: 'normal' } })
      });

      const response = exerciseService.saveExercise(mockExercise);

      expect(resultsService.saveResult).toHaveBeenCalledWith(
        mockExercise.result.personId,
        mockExercise.result.id,
        mockExercise.result.cmi
      );

      expect(response).toBeObservable(
        hot('-a-|', {
          a: mockExercise
        })
      );
    });
  });
});
