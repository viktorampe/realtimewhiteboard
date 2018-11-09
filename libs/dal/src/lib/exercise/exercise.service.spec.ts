import { inject, TestBed } from '@angular/core/testing';
import { ExerciseInterface, ResultInterface } from '@campus/dal';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import {
  ExerciseService,
  ResultsService,
  ScormCMIMode,
  TempUrlService
} from './exercise.service';
import { ExerciseServiceInterface } from './exercise.service.interface';

describe('ExerciseService', () => {
  let service: ExerciseServiceInterface;
  let mockResult$: Observable<ExerciseInterface>;
  let mockUrl$: Observable<any>;

  let mockData: {
    userId?: number;
    eduContentId?: number;
    taskId?: number;
    unlockedContentId?: number;
    url?: string;
    cmiMode?: ScormCMIMode;
  };

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
          provide: TempUrlService,
          useValue: {
            getTempUrl: () => mockUrl$
          }
        }
      ]
    });

    service = TestBed.get(ExerciseService);
  }),
    it('should be created and available via DI', inject(
      [ExerciseService],
      (exerciseService: ExerciseService) => {
        expect(exerciseService).toBeTruthy();
      }
    ));

  it('should return an exercise for a task', () => {
    mockData = {
      userId: 6,
      eduContentId: 1,
      taskId: 1,
      url: 'tempurl',
      cmiMode: ScormCMIMode.CMI_MODE_NORMAL
    };

    mockResult$ = hot('-a-|', {
      a: {
        id: 1,
        eduContentId: mockData.eduContentId,
        personId: mockData.userId,
        taskId: mockData.taskId,
        cmi: { mode: 'normal' }
      } as ResultInterface
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
        a: {
          eduContent: undefined,
          cmiMode: ScormCMIMode.CMI_MODE_NORMAL,
          result: {
            id: 1,
            eduContentId: mockData.eduContentId,
            personId: mockData.userId,
            taskId: mockData.taskId,
            cmi: { mode: ScormCMIMode.CMI_MODE_NORMAL }
          },
          saveToApi: true,
          url: 'tempurl'
        }
      })
    );
  });

  it('should return an exercise for an unlockedContent', () => {
    mockData = {
      userId: 6,
      eduContentId: 1,
      unlockedContentId: 1,
      url: 'tempurl',
      cmiMode: ScormCMIMode.CMI_MODE_NORMAL
    };

    mockResult$ = hot('-a-|', {
      a: {
        id: 1,
        eduContentId: mockData.eduContentId,
        personId: mockData.userId,
        unlockedContentId: mockData.unlockedContentId,
        cmi: { mode: 'normal' }
      } as ResultInterface
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
        a: {
          eduContent: undefined,
          cmiMode: ScormCMIMode.CMI_MODE_NORMAL,
          result: {
            id: 1,
            eduContentId: mockData.eduContentId,
            personId: mockData.userId,
            unlockedContentId: mockData.unlockedContentId,
            cmi: { mode: ScormCMIMode.CMI_MODE_NORMAL }
          },
          saveToApi: true,
          url: 'tempurl'
        }
      })
    );
  });
});
