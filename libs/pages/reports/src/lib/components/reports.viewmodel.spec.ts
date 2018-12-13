import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContent,
  EduContentActions,
  EduContentFixture,
  EduContentReducer,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  ResultActions,
  ResultFixture,
  ResultInterface,
  ResultReducer
} from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { ReportService } from './../services/report.service';
import { ReportsViewModel } from './reports.viewmodel';
import { AssignmentResult } from './reports.viewmodel.interfaces';

let reportsViewModel: ReportsViewModel;
let store: Store<DalState>;

describe('ReportsViewModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          LearningAreaReducer,
          EduContentReducer,
          ResultReducer
        ])
      ],
      providers: [
        ReportsViewModel,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: PersonApi, useValue: {} },
        {
          provide: ReportService,
          useValue: { getAssignmentResults: () => {} }
        },
        Store
      ]
    });
    reportsViewModel = TestBed.get(ReportsViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(reportsViewModel).toBeDefined();
    });
  });

  describe('presentation streams', () => {
    describe('getLearningAreaById', () => {
      const mockLearningAreas = [
        new LearningAreaFixture({ id: 1 }),
        new LearningAreaFixture({ id: 2 })
      ];
      beforeEach(() => {
        store.dispatch(
          new LearningAreaActions.LearningAreasLoaded({
            learningAreas: mockLearningAreas
          })
        );
      });

      it('should return the requested LearningArea', () => {
        const returnedValue = reportsViewModel.getLearningAreaById(2);

        expect(returnedValue).toBeObservable(
          hot('a', { a: mockLearningAreas[1] })
        );
      });
    });

    describe('getAssignmentResultsByLearningArea', () => {
      let service: ReportService;
      let mockEduContents: EduContent[];
      let mockResults: ResultInterface[];

      beforeEach(() => {
        service = TestBed.get(ReportService);

        mockEduContents = [new EduContentFixture()];
        store.dispatch(
          new EduContentActions.EduContentsLoaded({
            eduContents: mockEduContents
          })
        );

        mockResults = [
          new ResultFixture({ learningAreaId: 1, taskId: 1, bundleId: 1 })
        ];
        store.dispatch(
          new ResultActions.ResultsLoaded({
            results: mockResults
          })
        );
      });

      it('should call the reportsService', () => {
        spyOn(service, 'getAssignmentResults').and.returnValue([]);

        reportsViewModel.getAssignmentResultsByLearningArea(1).subscribe();

        expect(service.getAssignmentResults).toHaveBeenCalled();
        expect(service.getAssignmentResults).toHaveBeenCalledTimes(2);
        expect(service.getAssignmentResults).toHaveBeenCalledWith(
          { 1: mockResults },
          'task',
          { 1: mockEduContents[0] }
        );
        expect(service.getAssignmentResults).toHaveBeenCalledWith(
          { 1: mockResults },
          'bundle',
          { 1: mockEduContents[0] }
        );
      });

      it('should return the array of assignmentResults of the service', () => {
        const mockReturn: AssignmentResult = {
          title: 'foo',
          type: 'foo',
          totalScore: 42,
          exerciseResults: [
            {
              eduContentId: 1,
              eduContent: mockEduContents[0],
              results: mockResults,
              bestResult: mockResults[0],
              averageScore: mockResults[0].score
            }
          ]
        };

        spyOn(service, 'getAssignmentResults').and.returnValue([mockReturn]);

        const returnValue = reportsViewModel.getAssignmentResultsByLearningArea(
          1
        );

        // calls function twice
        const expectedValue = [mockReturn, mockReturn];

        expect(returnValue).toBeObservable(hot('a', { a: expectedValue }));
      });
    });
  });
});
