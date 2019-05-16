import { inject, TestBed } from '@angular/core/testing';
import { LearningAreaApi } from '@diekeure/polpo-api-angular-sdk';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { LearningAreaInterface } from '../+models';
import { LearningAreaFixture } from './../+fixtures/LearningArea.fixture';
import { LearningAreaService } from './learning-area.service';
import { LearningAreaServiceInterface } from './learning-area.service.interface';

describe('LearningAreaService', () => {
  let learningAreaApi: LearningAreaApi;
  let learningAreaService: LearningAreaServiceInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LearningAreaService,
        { provide: LearningAreaApi, useValue: { find: () => {} } }
      ]
    });

    learningAreaApi = TestBed.get(LearningAreaApi);
    learningAreaService = TestBed.get(LearningAreaService);
  });

  it('should be created', inject(
    [LearningAreaService],
    (service: LearningAreaService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should add a prefix to the icon, if needed', () => {
    const mockLearningArea: LearningAreaInterface[] = [
      new LearningAreaFixture({ id: 1, icon: 'foo' }),
      new LearningAreaFixture({ id: 2, icon: 'learning-area:bar' })
    ];

    learningAreaApi.find = jest.fn().mockReturnValue(of(mockLearningArea));

    expect(learningAreaService.getAll()).toBeObservable(
      cold('(a|)', {
        a: [
          new LearningAreaFixture({ id: 1, icon: 'learning-area:foo' }),
          new LearningAreaFixture({ id: 2, icon: 'learning-area:bar' })
        ]
      })
    );
  });
});
