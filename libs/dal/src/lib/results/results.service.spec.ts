import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { ResultFixture } from '../+fixtures';
import { ResultInterface } from '../+models';
import { ScormCmiMode, ScormStatus } from '../+external-interfaces/scorm-api.interface';
import { ResultsService } from './results.service';
import { ResultsServiceInterface } from './results.service.interface';

describe('ResultsService', () => {
  let service: ResultsServiceInterface;
  let mockData$: Observable<ResultInterface>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$,
            resultForTask: () => mockData$,
            resultForUnlockedContent: () => mockData$,
            saveResult: () => mockData$
          }
        },
        ResultsService
      ]
    });
    service = TestBed.get(ResultsService);
  });

  it('should be created and available via DI', inject(
    [ResultsService],
    (resultsService: ResultsService) => {
      expect(resultsService).toBeTruthy();
    }
  ));

  it('should return results for tasks', () => {
    const response = {
      score: null,
      time: null,
      status: 'incomplete',
      cm: null,
      created: new Date('2018-11-07T16:06:15.000Z'),
      id: 2,
      eduContentId: 1,
      personId: 6,
      taskId: 1
    };

    mockData$ = hot('-a-|', {
      a: response
    });
    expect(service.getResultForTask(6, 1, 1)).toBeObservable(
      hot('-a-|', {
        a: (response as unknown) as ResultInterface
      })
    );
  });

  it('should return results for unlockedContent', () => {
    const response = {
      score: null,
      time: null,
      status: 'incomplete',
      cm: null,
      created: new Date('2018-11-07T16:06:15.000Z'),
      id: 2,
      eduContentId: 1,
      personId: 6,
      unlockedContentId: 1
    };

    mockData$ = hot('-a-|', {
      a: response
    });
    expect(service.getResultForUnlockedContent(6, 1, 1)).toBeObservable(
      hot('-a-|', {
        a: (response as unknown) as ResultInterface
      })
    );
  });

  it('should return the result when it is saved', () => {
    const response = JSON.parse(
      '{ "score": 100, "time": 64760, "status": "completed", "cmi": { "mode": "normal", "core": { "score": { "raw": 100 }, "lesson_location": "", "lesson_status": "completed", "total_time": "0:1:4.76", "session_time": "0000:00:00" } }, "created": "2018-11-07T16:11:24.000Z", "id": 3, "eduContentId": 1, "personId": 6, "taskId": null, "unlockedContentId": 1 }'
    );

    const cmi = {
      mode: ScormCmiMode.CMI_MODE_NORMAL,
      core: {
        score: { raw: 100 },
        lesson_location: '',
        lesson_status: ScormStatus.STATUS_COMPLETED,
        total_time: '0:1:4.76',
        session_time: '0000:00:00'
      }
    };

    mockData$ = hot('-a-|', {
      a: response
    });
    expect(service.saveResult(6, cmi as any)).toBeObservable(
      hot('-a-|', {
        a: response as ResultInterface
      })
    );
  });
  it('should return results and map those when calling getAllForUser', async () => {
    mockData$ = hot('-a-|', {
      a: {
        results: [new ResultFixture({ id: 1 }), new ResultFixture({ id: 2 })]
      }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [new ResultFixture({ id: 1 }), new ResultFixture({ id: 2 })]
      })
    );
  });
});
