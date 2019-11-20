import { TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { MethodLevelServiceInterface } from '.';
import { MethodLevelFixture } from '../+fixtures';
import { MethodLevelService } from './method-level.service';

describe('MethodLevelService', () => {
  let methodLevelService: MethodLevelServiceInterface;
  let mockData$: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MethodLevelService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });

    methodLevelService = TestBed.get(MethodLevelService);
  });

  it('should be created', () => {
    expect(methodLevelService).toBeTruthy();
  });

  it('should return methodlevels', () => {
    mockData$ = hot('-a-|', {
      a: {
        methodLevels: [
          new MethodLevelFixture({ id: 1 }),
          new MethodLevelFixture({ id: 2 })
        ]
      }
    });
    expect(methodLevelService.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [
          new MethodLevelFixture({ id: 1 }),
          new MethodLevelFixture({ id: 2 })
        ]
      })
    );
  });
});
