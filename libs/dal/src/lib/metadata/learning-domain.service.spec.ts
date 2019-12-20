import { inject, TestBed } from '@angular/core/testing';
import { LearningDomainApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { LearningDomainFixture } from '../+fixtures/LearningDomain.fixture';
import { LearningDomainService } from './learning-domain.service';
import { LearningDomainServiceInterface } from './learning-domain.service.interface';

describe('LearningDomainService', () => {
  let learningDomainService: LearningDomainServiceInterface;
  let mockData$: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LearningDomainService,
        {
          provide: LearningDomainApi,
          useValue: {
            find: () => mockData$
          }
        }
      ]
    });
    learningDomainService = TestBed.get(LearningDomainService);
  });

  it('should be created', inject(
    [LearningDomainService],
    (service: LearningDomainService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return LearningDomains', () => {
    mockData$ = hot('-a-|', {
      a: [
        new LearningDomainFixture({ id: 1 }),
        new LearningDomainFixture({ id: 2 })
      ]
    });
    expect(learningDomainService.getAll()).toBeObservable(
      hot('-a-|', {
        a: [
          new LearningDomainFixture({ id: 1 }),
          new LearningDomainFixture({ id: 2 })
        ]
      })
    );
  });
});
