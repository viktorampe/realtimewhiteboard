import { inject, TestBed } from '@angular/core/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { CurrentExerciseFixture } from '../+fixtures';
import { CurrentExerciseInterface } from '../+state/current-exercise/current-exercise.reducer';
import { ResultFixture } from './../+fixtures/Result.fixture';
import {
  ContentRequestService,
  ExerciseService,
  ResultsService
} from './exercise.service';
import { ExerciseServiceInterface } from './exercise.service.interface';

describe('ExerciseService', () => {
  let service: ExerciseServiceInterface;
  let mockResult$: Observable<CurrentExerciseInterface>;
  let mockUrl$: Observable<any>;

  let mockData: {
    userId?: number;
    eduContentId?: number;
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
            getResultForUnlockedContent: () => mockResult$
          }
        },
        {
          provide: ContentRequestService,
          useValue: {
            getTempUrl: () => mockUrl$
          }
        }
      ]
    });

    service = TestBed.get(ExerciseService);

    mockData = {
      eduContentId: 1,
      taskId: 1,
      url: 'tempurl'
    };

    mockExercise = new CurrentExerciseFixture({
      result: new ResultFixture({ cmi: { mode: 'normal' } })
    });
  }),
    it('should be created and available via DI', inject(
      [ExerciseService],
      (exerciseService: ExerciseService) => {
        expect(exerciseService).toBeTruthy();
      }
    ));

  it('should return an exercise for a task', () => {
    mockResult$ = hot('-a-|', {
      a: new ResultFixture({ cmi: { mode: 'normal' } })
    });

    mockUrl$ = hot('-a-|', {
      a: mockData.url
    });

    expect(
      service.startExercise(
        mockData.userId,
        mockData.eduContentId,
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
      service.startExercise(
        mockData.userId,
        mockData.eduContentId,
        null,
        mockData.unlockedContentId
      )
    ).toBeObservable(
      hot('-a-|', {
        a: mockExercise
      })
    );
  });
});
