import { TestBed } from '@angular/core/testing';
import {
  EduContentMetadataApi,
  LearningPlanApi
} from '@diekeure/polpo-api-angular-sdk';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { LearningPlanAssignmentFixture, YearFixture } from '../+fixtures';
import { LearningPlanFixture } from './../+fixtures/LearningPlan.fixture';
import { SpecialtyFixture } from './../+fixtures/Specialty.fixture';
import { LearningPlanService } from './learning-plan.service';
import { LearningPlanServiceInterface } from './learning-plan.service.interface';

describe('LearningPlanService', () => {
  let learningPlanService: LearningPlanServiceInterface;
  let learningPlanApi: LearningPlanApi;
  let eduContentMetadataApi: EduContentMetadataApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LearningPlanService,
        { provide: LearningPlanApi, useValue: { find: () => {} } },
        {
          provide: EduContentMetadataApi,
          useValue: { searchYearsForPlans: () => {} }
        }
      ]
    });

    learningPlanService = TestBed.get(LearningPlanService);
    learningPlanApi = TestBed.get(LearningPlanApi);
    eduContentMetadataApi = TestBed.get(EduContentMetadataApi);
  });

  it('should be created', () => {
    const service: LearningPlanService = TestBed.get(LearningPlanService);
    expect(service).toBeTruthy();
  });

  describe('getAvailableYearsForSearch', () => {
    it('should return the years from the api', () => {
      const mockReturnValue = [
        new YearFixture({ id: 1 }),
        new YearFixture({ id: 2 })
      ];
      eduContentMetadataApi.searchYearsForPlans = jest
        .fn()
        .mockReturnValue(of(mockReturnValue));

      const response = learningPlanService.getAvailableYearsForSearch(1, 1, 1);

      expect(response).toBeObservable(cold('(a|)', { a: mockReturnValue }));
    });
  });

  describe('getLearningPlanAssignments', () => {
    it('should return the learningPlanAssignments from the api', () => {
      const mockSpecialty = new SpecialtyFixture({ id: 1 });

      const mockReturnValue = [
        new LearningPlanFixture({ id: 1 }, [
          new LearningPlanAssignmentFixture({
            id: 1,
            learningPlanId: 1,
            specialtyId: mockSpecialty.id,
            specialty: mockSpecialty
          })
        ]),
        new LearningPlanFixture({ id: 2 }, [
          new LearningPlanAssignmentFixture({
            id: 2,
            learningPlanId: 2,
            specialtyId: mockSpecialty.id,
            specialty: mockSpecialty
          })
        ])
      ];
      learningPlanApi.find = jest.fn().mockReturnValue(of(mockReturnValue));

      const response = learningPlanService.getLearningPlanAssignments(
        1,
        1,
        1,
        1
      );

      const expected = new Map([
        [
          mockSpecialty,
          [mockReturnValue[0].assignments[0], mockReturnValue[1].assignments[0]]
        ]
      ]);

      expect(response).toBeObservable(cold('(a|)', { a: expected }));
    });
  });
});
