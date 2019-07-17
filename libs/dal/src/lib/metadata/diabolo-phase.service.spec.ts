import { TestBed } from '@angular/core/testing';
import { DiaboloPhaseApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';
import { DiaboloPhaseFixture } from './../+fixtures/DiaboloPhase.fixture';
import { DiaboloPhaseService } from './diabolo-phase.service';
import { DiaboloPhaseServiceInterface } from './diabolo-phase.service.interface';

describe('DiaboloPhaseService', () => {
  let mockData$: any;
  let diaboloPhaseService: DiaboloPhaseServiceInterface;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DiaboloPhaseApi, useValue: { find: () => mockData$ } }
      ]
    });

    diaboloPhaseService = TestBed.get(DiaboloPhaseService);
  });

  it('should be created', () => {
    expect(diaboloPhaseService).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return diaboloPhases', async () => {
      mockData$ = hot('-a-|', {
        a: [
          new DiaboloPhaseFixture({ id: 1 }),
          new DiaboloPhaseFixture({ id: 2 })
        ]
      });
      expect(diaboloPhaseService.getAll()).toBeObservable(
        hot('-a-|', {
          a: [
            new DiaboloPhaseFixture({ id: 1 }),
            new DiaboloPhaseFixture({ id: 2 })
          ]
        })
      );
    });
  });
});
