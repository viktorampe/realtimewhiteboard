import { ModuleWithProviders } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WINDOW } from '@campus/browser';
import {
  AlertActions,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  BundleFixture,
  BundleInterface,
  BundleReducer,
  ContentStatusActions,
  ContentStatusFixture,
  ContentStatusInterface,
  ContentStatusLabel,
  ContentStatusReducer,
  DalState,
  EduContent,
  EduContentActions,
  EduContentFixture,
  EduContentInterface,
  EduContentReducer,
  HistoryActions,
  HistoryInterface,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  LinkedPersonActions,
  LinkedPersonReducer,
  PersonFixture,
  PersonInterface,
  StateFeatureBuilder,
  StudentContentStatusActions,
  StudentContentStatusFixture,
  StudentContentStatusInterface,
  StudentContentStatusReducer,
  UiActions,
  UiReducer,
  UnlockedBoekeGroupActions,
  UnlockedBoekeGroupFixture,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentActions,
  UnlockedBoekeStudentInterface,
  UnlockedBoekeStudentReducer,
  UnlockedContentActions,
  UnlockedContentFixture,
  UnlockedContentInterface,
  UnlockedContentReducer,
  UserActions,
  UserContentActions,
  UserContentReducer,
  UserReducer
} from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  PermissionService,
  PERMISSION_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { MockDate, MockWindow } from '@campus/testing';
import { ListFormat } from '@campus/ui';
import { UnlockedContent } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { BundlesViewModel } from './bundles.viewmodel';
import { LearningAreasWithBundlesInfoInterface } from './bundles.viewmodel.interfaces';

describe('BundlesViewModel', () => {
  let bundlesViewModel: BundlesViewModel;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let scormExerciseService: ScormExerciseServiceInterface;
  let mockWindow: MockWindow;
  let uiState: UiReducer.UiState;
  let learningAreaState: LearningAreaReducer.State;
  let bundleState: BundleReducer.State;
  let unlockedBoekeGroupState: UnlockedBoekeGroupReducer.State;
  let unlockedBoekeStudentState: UnlockedBoekeStudentReducer.State;
  let unlockedContentState: UnlockedContentReducer.State;
  let eduContentState: EduContentReducer.State;
  let userContentState: UserContentReducer.State;
  let coupledPersonState: LinkedPersonReducer.State;
  let studentContentStatusState: StudentContentStatusReducer.State;
  let contentStatusState: ContentStatusReducer.State;
  let userState: UserReducer.State;

  let ui: UiReducer.UiState;
  let learningAreas: LearningAreaInterface[];
  let bundles: BundleInterface[];
  let unlockedBoekeGroups: UnlockedBoekeGroupInterface[];
  let unlockedBoekeStudents: UnlockedBoekeStudentInterface[];
  let unlockedContents: UnlockedContentInterface[];
  let eduContents: EduContentInterface[];
  let coupledPersons: PersonInterface[];
  let studentContentStatuses: StudentContentStatusInterface[];
  let contentStatuses: ContentStatusInterface[];
  let store: Store<DalState>;

  beforeAll(() => {
    loadState();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), ...getModuleWithForFeatureProviders()],
      providers: [
        BundlesViewModel,
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        },
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useValue: { startExerciseFromUnlockedContent: jest.fn() }
        },
        {
          provide: WINDOW,
          useClass: MockWindow
        },
        {
          provide: PERMISSION_SERVICE_TOKEN,
          useClass: PermissionService
        }
      ]
    });

    bundlesViewModel = TestBed.get(BundlesViewModel);
    store = TestBed.get(Store);
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
    mockWindow = TestBed.get(WINDOW);
  });

  it('should be defined', () => {
    expect(bundlesViewModel).toBeDefined();
  });

  it('changeListFormat() should update uiStore', () => {
    const spy = jest.spyOn(UiActions, 'SetListFormat');
    const listFormat = ListFormat.GRID;
    bundlesViewModel.changeListFormat(listFormat);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ listFormat });
  });
  describe('#openContent', () => {
    const unlockedContent = new UnlockedContentFixture({
      id: 1,
      eduContent: new EduContentFixture({ type: 'file' })
    });

    it('should call the open static content service for EduContent', () => {
      bundlesViewModel.openContent(unlockedContent);
      expect(openStaticContentService.open).toHaveBeenCalledTimes(1);
      expect(openStaticContentService.open).toHaveBeenCalledWith(
        unlockedContent.content
      );
    });

    it('should dispatch a startUpsertHistory action when the user has this permission', () => {
      store.dispatch(new UserActions.PermissionsLoaded(['manageHistory']));

      const mockDate = new MockDate();
      const spy = jest.spyOn(store, 'dispatch');

      bundlesViewModel.openContent(unlockedContent);

      expect(spy).toHaveBeenCalledWith(
        new HistoryActions.StartUpsertHistory({
          history: {
            name: 'foo',
            type: 'educontent',
            learningAreaId: 1,
            eduContentId: 1,
            created: mockDate.mockDate
          }
        })
      );
      mockDate.returnRealDate();
    });

    it('should not dispatch a startUpsertHistory action when the user does not have this permission', () => {
      store.dispatch(new UserActions.PermissionsLoaded(['foo']));

      const spy = jest.spyOn(store, 'dispatch');

      bundlesViewModel.openContent(unlockedContent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should call the scormExerciseService for eduContent', () => {
      const mockUnlockedContent = new UnlockedContentFixture({
        id: 5,
        eduContent: new EduContentFixture({ type: 'exercise' }),
        teacherId: 123 //can't be 1, since that is the userId
      });
      bundlesViewModel.openContent(mockUnlockedContent);
      expect(
        scormExerciseService.startExerciseFromUnlockedContent
      ).toHaveBeenCalledTimes(1);
      expect(
        scormExerciseService.startExerciseFromUnlockedContent
      ).toHaveBeenCalledWith(
        1,
        mockUnlockedContent.eduContentId,
        mockUnlockedContent.id
      );
    });
  });

  it('set alerts read by a filter', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new AlertActions.SetAlertReadByFilter({
      filter: { bundleId: 1 },
      intended: false,
      personId: 1,
      read: true,
      displayResponse: false
    });
    bundlesViewModel.setBundleAlertRead(1);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('sharedLearningAreas$', () => {
    expect(bundlesViewModel.sharedLearningAreas$).toBeObservable(
      hot('a', {
        a: <LearningAreasWithBundlesInfoInterface>{
          learningAreas: [
            {
              learningArea: learningAreas[0],
              bundleCount: 1,
              bookCount: 2
            },
            {
              learningArea: learningAreas[1],
              bundleCount: 1,
              bookCount: 1
            },
            {
              learningArea: learningAreas[2],
              bundleCount: 1,
              bookCount: 0
            }
          ]
        }
      })
    );
  });

  it('getLearningAreaById()', () => {
    expect(bundlesViewModel.getLearningAreaById(1)).toBeObservable(
      hot('a', {
        a: learningAreas[0]
      })
    );
  });

  it('getBundleById()', () => {
    expect(bundlesViewModel.getBundleById(1)).toBeObservable(
      hot('a', {
        a: bundles[0]
      })
    );
  });

  it('getBundleOwner()', () => {
    expect(bundlesViewModel.getBundleOwner(of(bundles[0]))).toBeObservable(
      hot('a', {
        a: coupledPersons[0]
      })
    );
  });

  it('getBundleContents()', () => {
    expect(bundlesViewModel.getBundleContents(1)).toBeObservable(
      hot('a', {
        a: [
          Object.assign(new UnlockedContent(), {
            ...unlockedContents[0],
            eduContent: Object.assign(new EduContent(), eduContents[0])
          })
        ]
      })
    );
  });

  it('getSharedBundlesWithContentInfo()', () => {
    expect(bundlesViewModel.getSharedBundlesWithContentInfo(1)).toBeObservable(
      hot('a', {
        a: {
          bundles: [
            {
              bundle: bundles[0],
              contentsCount: 1
            }
          ],
          books: [eduContents[0], eduContents[1]]
        }
      })
    );
  });

  it('saveContentStatus()', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new StudentContentStatusActions.UpsertStudentContentStatus(
      {
        studentContentStatus: {
          personId: 1,
          unlockedContentId: 1,
          contentStatusId: 2
        }
      }
    );
    bundlesViewModel.saveContentStatus(1, 2);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('getContentStatusOptions()', () => {
    expect(bundlesViewModel.getContentStatusOptions()).toBeObservable(
      hot('a', {
        a: [
          { value: 0, viewValue: ContentStatusLabel.NEW },
          { value: 1, viewValue: ContentStatusLabel.FINISHED },
          { value: 2, viewValue: ContentStatusLabel.PENDING }
        ]
      })
    );
  });

  describe('#openBook', () => {
    it('should call openStaticContentService', () => {
      const spy = jest.spyOn(openStaticContentService, 'open');
      const book = new EduContentFixture({ type: 'boek-e' });

      bundlesViewModel.openBook(book);

      expect(spy).toHaveBeenCalledWith(book);
    });
  });

  it('should dispatch a startUpsertHistoryAction if the user has the permission', () => {
    store.dispatch(new UserActions.PermissionsLoaded(['manageHistory']));

    const mockDate = new MockDate();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const book = new EduContentFixture({ type: 'boek-e' });
    const expectedHistory: HistoryInterface = {
      name: book.publishedEduContentMetadata.title,
      type: 'boek-e',
      learningAreaId: book.publishedEduContentMetadata.learningAreaId,
      eduContentId: 1,
      created: mockDate.mockDate
    };

    bundlesViewModel.openBook(book);

    expect(dispatchSpy).toHaveBeenCalledWith(
      new HistoryActions.StartUpsertHistory({ history: expectedHistory })
    );

    mockDate.returnRealDate();
  });

  it('should not dispatch a startUpsertHistoryAction if the user does not have the permission', () => {
    store.dispatch(new UserActions.PermissionsLoaded(['foo']));

    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const book = new EduContentFixture({ type: 'boek-e' });

    bundlesViewModel.openBook(book);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  function loadState() {
    ui = {
      listFormat: ListFormat.LINE,
      loaded: true
    };
    uiState = UiReducer.reducer(
      UiReducer.initialState,
      new UiActions.UiLoaded({ state: ui })
    );

    learningAreas = [
      new LearningAreaFixture({ id: 1 }),
      new LearningAreaFixture({ id: 2 }),
      new LearningAreaFixture({ id: 3 }),
      new LearningAreaFixture({ id: 4 }),
      new LearningAreaFixture({ id: 5 })
    ];
    learningAreaState = LearningAreaReducer.reducer(
      LearningAreaReducer.initialState,
      new LearningAreaActions.LearningAreasLoaded({
        learningAreas: learningAreas
      })
    );

    bundles = [
      // shared
      new BundleFixture({ id: 1, teacherId: 2, learningAreaId: 1 }),
      new BundleFixture({ id: 2, teacherId: 2, learningAreaId: 2 }),
      new BundleFixture({ id: 3, teacherId: 2, learningAreaId: 3 }),
      // own
      new BundleFixture({ id: 4, teacherId: 1, learningAreaId: 4 }),
      new BundleFixture({ id: 5, teacherId: 1, learningAreaId: 5 })
    ];
    bundleState = BundleReducer.reducer(
      BundleReducer.initialState,
      new BundleActions.BundlesLoaded({
        bundles: bundles
      })
    );

    unlockedBoekeStudents = [];
    unlockedBoekeStudentState = UnlockedBoekeStudentReducer.reducer(
      UnlockedBoekeStudentReducer.initialState,
      new UnlockedBoekeStudentActions.UnlockedBoekeStudentsLoaded({
        unlockedBoekeStudents: unlockedBoekeStudents
      })
    );

    unlockedBoekeGroups = [
      // shared books
      new UnlockedBoekeGroupFixture({ id: 1, teacherId: 2, eduContentId: 1 }),
      new UnlockedBoekeGroupFixture({ id: 2, teacherId: 2, eduContentId: 2 }),
      new UnlockedBoekeGroupFixture({ id: 3, teacherId: 2, eduContentId: 3 })
    ];
    unlockedBoekeGroupState = UnlockedBoekeGroupReducer.reducer(
      UnlockedBoekeGroupReducer.initialState,
      new UnlockedBoekeGroupActions.UnlockedBoekeGroupsLoaded({
        unlockedBoekeGroups: unlockedBoekeGroups
      })
    );

    unlockedContents = [
      // shared
      new UnlockedContentFixture({ id: 1, bundleId: 1, teacherId: 2 }),
      new UnlockedContentFixture({ id: 2, bundleId: 2, teacherId: 2 }),
      new UnlockedContentFixture({ id: 3, bundleId: 3, teacherId: 2 })
    ];
    unlockedContentState = UnlockedContentReducer.reducer(
      UnlockedContentReducer.initialState,
      new UnlockedContentActions.UnlockedContentsLoaded({
        unlockedContents: unlockedContents
      })
    );

    eduContents = [
      // shared books
      new EduContentFixture({ id: 1 }, { learningAreaId: 1 }),
      new EduContentFixture({ id: 2 }, { learningAreaId: 1 }),
      new EduContentFixture({ id: 3 }, { learningAreaId: 2 })
    ];
    eduContentState = EduContentReducer.reducer(
      EduContentReducer.initialState,
      new EduContentActions.EduContentsLoaded({
        eduContents: eduContents
      })
    );

    userContentState = UserContentReducer.reducer(
      UserContentReducer.initialState,
      new UserContentActions.UserContentsLoaded({
        userContents: []
      })
    );

    coupledPersons = [new PersonFixture({ id: 2 })];
    coupledPersonState = LinkedPersonReducer.reducer(
      LinkedPersonReducer.initialState,
      new LinkedPersonActions.LinkedPersonsLoaded({
        persons: coupledPersons
      })
    );

    studentContentStatuses = [
      new StudentContentStatusFixture({ id: 1, unlockedContentId: 1 }),
      new StudentContentStatusFixture({ id: 2, unlockedContentId: 2 })
    ];
    studentContentStatusState = StudentContentStatusReducer.reducer(
      StudentContentStatusReducer.initialState,
      new StudentContentStatusActions.StudentContentStatusesLoaded({
        studentContentStatuses
      })
    );

    contentStatuses = [
      new ContentStatusFixture({
        id: 1,
        label: 'FINISHED' as ContentStatusLabel
      }),
      new ContentStatusFixture({
        id: 2,
        label: 'PENDING' as ContentStatusLabel
      })
    ];
    contentStatusState = ContentStatusReducer.reducer(
      ContentStatusReducer.initialState,
      new ContentStatusActions.ContentStatusesLoaded({
        contentStatuses
      })
    );
  }

  function getModuleWithForFeatureProviders(): ModuleWithProviders[] {
    return StateFeatureBuilder.getModuleWithForFeatureProviders([
      {
        NAME: UiReducer.NAME,
        reducer: UiReducer.reducer,
        initialState: {
          initialState: uiState
        }
      },
      {
        NAME: LearningAreaReducer.NAME,
        reducer: LearningAreaReducer.reducer,
        initialState: {
          initialState: learningAreaState
        }
      },
      {
        NAME: BundleReducer.NAME,
        reducer: BundleReducer.reducer,
        initialState: {
          initialState: bundleState
        }
      },
      {
        NAME: UnlockedBoekeGroupReducer.NAME,
        reducer: UnlockedBoekeGroupReducer.reducer,
        initialState: {
          initialState: unlockedBoekeGroupState
        }
      },
      {
        NAME: UnlockedBoekeStudentReducer.NAME,
        reducer: UnlockedBoekeStudentReducer.reducer,
        initialState: {
          initialState: unlockedBoekeStudentState
        }
      },
      {
        NAME: UnlockedContentReducer.NAME,
        reducer: UnlockedContentReducer.reducer,
        initialState: {
          initialState: unlockedContentState
        }
      },
      {
        NAME: EduContentReducer.NAME,
        reducer: EduContentReducer.reducer,
        initialState: {
          initialState: eduContentState
        }
      },
      {
        NAME: UserContentReducer.NAME,
        reducer: UserContentReducer.reducer,
        initialState: {
          initialState: userContentState
        }
      },
      {
        NAME: LinkedPersonReducer.NAME,
        reducer: LinkedPersonReducer.reducer,
        initialState: {
          initialState: coupledPersonState
        }
      },
      {
        NAME: StudentContentStatusReducer.NAME,
        reducer: StudentContentStatusReducer.reducer,
        initialState: {
          initialState: studentContentStatusState
        }
      },
      {
        NAME: ContentStatusReducer.NAME,
        reducer: ContentStatusReducer.reducer,
        initialState: {
          initialState: contentStatusState
        }
      },
      {
        NAME: UserReducer.NAME,
        reducer: UserReducer.reducer,
        initialState: {
          initialState: userState
        }
      }
    ]);
  }
});
