import { inject, TestBed } from '@angular/core/testing';
import { PersonApi, ResultInterface } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { ScormCMIMode } from './enums/cmi-mode.enum';
import { ScormStatus } from './enums/scorm-status.enum';
import { ScormResultsService } from './scorm-results.service';
import { ScormResultsServiceInterface } from './scorm-results.service.interface';

describe('ScormResultsService', () => {
  let service: ScormResultsServiceInterface;
  let mockData$: Observable<object>;

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
        ScormResultsService
      ]
    });
    service = TestBed.get(ScormResultsService);
  });

  it('should be created and available via DI', inject(
    [ScormResultsService],
    (scormResultsService: ScormResultsService) => {
      expect(scormResultsService).toBeTruthy();
    }
  ));

  it('should return results for tasks', () => {
    const response = {
      score: null,
      time: null,
      status: 'incomplete',
      cm: null,
      created: '2018-11-07T16:06:15.000Z',
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
        a: response as ResultInterface
      })
    );
  });

  it('should return results for unlockedContent', () => {
    const response = {
      score: null,
      time: null,
      status: 'incomplete',
      cm: null,
      created: '2018-11-07T16:06:15.000Z',
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
        a: response as ResultInterface
      })
    );
  });

  it('should return the result when it is saved', () => {
    const response = JSON.parse(
      '{ "score": 100, "time": 64760, "status": "completed", "cmi": { "mode": "normal", "core": { "score": { "raw": 100 }, "lesson_location": "", "lesson_status": "completed", "total_time": "0:1:4.76", "session_time": "0000:00:00" } }, "created": "2018-11-07T16:11:24.000Z", "id": 3, "eduContentId": 1, "personId": 6, "taskId": null, "unlockedContentId": 1 }'
    );

    const cmi = {
      mode: ScormCMIMode.CMI_MODE_NORMAL,
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
    expect(service.saveResult(6, 3, cmi)).toBeObservable(
      hot('-a-|', {
        a: response as ResultInterface
      })
    );
  });
});
