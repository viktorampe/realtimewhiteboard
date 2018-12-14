import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  ContentFixture,
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
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { ReportService } from './../services/report.service';
import { ReportsViewModel } from './reports.viewmodel';
import {
  AssignmentResultInterface,
  LearningAreasWithResultsInterface
} from './reports.viewmodel.interfaces';

let reportsViewModel: ReportsViewModel;
let store: Store<DalState>;
let openStaticContentService: OpenStaticContentServiceInterface;
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
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        },
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
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(reportsViewModel).toBeDefined();
    });
    it('should set the streams', () => {
      expect(reportsViewModel.user$).toBeDefined();
      expect(reportsViewModel.listFormat$).toBeDefined();
      expect(reportsViewModel.learningAreasWithResults$).toBeDefined();
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
        const mockReturn: AssignmentResultInterface = {
          title: 'foo',
          type: 'foo',
          totalScore: 42,
          exerciseResults: [
            {
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

    describe('getLearningAreasWithResult', () => {
      const mockLearningAreas = [
        new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
        new LearningAreaFixture({ id: 2, name: 'frans' }),
        new LearningAreaFixture({ id: 3, name: 'chemie' })
      ];
      const mockResults = [
        new ResultFixture({
          id: 1,
          learningAreaId: 1,
          taskId: 1,
          bundleId: null
        }),
        new ResultFixture({
          id: 2,
          learningAreaId: 3,
          taskId: 1,
          bundleId: null
        }),
        new ResultFixture({
          id: 3,
          learningAreaId: 1,
          taskId: 2,
          bundleId: null
        }),
        new ResultFixture({
          id: 4,
          learningAreaId: 1,
          taskId: 3,
          bundleId: null
        }),
        new ResultFixture({
          id: 5,
          learningAreaId: 2,
          bundleId: 2,
          taskId: null
        }),
        new ResultFixture({
          id: 6,
          learningAreaId: 2,
          bundleId: 2,
          taskId: null
        })
      ];
      beforeEach(() => {
        store.dispatch(
          new LearningAreaActions.LearningAreasLoaded({
            learningAreas: mockLearningAreas
          })
        );
        store.dispatch(
          new ResultActions.ResultsLoaded({ results: mockResults })
        );
      });

      it('should return results grouped by learning areas and tasks/bundles', () => {
        const expectedValue: LearningAreasWithResultsInterface = {
          learningAreas: [
            {
              learningArea: mockLearningAreas[0],
              tasksWithResultsCount: 3,
              bundlesWithResultsCount: 0
            },
            {
              learningArea: mockLearningAreas[1],
              tasksWithResultsCount: 0,
              bundlesWithResultsCount: 1
            },
            {
              learningArea: mockLearningAreas[2],
              tasksWithResultsCount: 1,
              bundlesWithResultsCount: 0
            }
          ]
        };

        const returnValue = reportsViewModel.learningAreasWithResults$;
        expect(returnValue).toBeObservable(hot('a', { a: expectedValue }));
      });
    });
  });

  it('openBook() should call openStaticContentService', () => {
    const contentFixture = new ContentFixture();
    reportsViewModel.openBook(contentFixture);

    expect(openStaticContentService.open).toHaveBeenCalledTimes(1);
    expect(openStaticContentService.open).toHaveBeenCalledWith(contentFixture);
  });
});
