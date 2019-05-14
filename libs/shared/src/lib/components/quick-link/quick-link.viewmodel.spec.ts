import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  BundleActions,
  BundleFixture,
  BundleInterface,
  BundleReducer,
  DalActions,
  DalState,
  EduContent,
  EduContentActions,
  EduContentFixture,
  EduContentReducer,
  EffectFeedbackActions,
  EffectFeedbackFixture,
  EffectFeedbackInterface,
  EffectFeedbackReducer,
  FavoriteActions,
  FavoriteFixture,
  FavoriteInterface,
  FavoriteReducer,
  FavoriteTypesEnum,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  Priority,
  TaskActions,
  TaskFixture,
  TaskInterface,
  TaskReducer
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { Update } from '@ngrx/entity';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import { QuickLinkViewModel } from './quick-link.viewmodel';

describe('QuickLinkViewModel', () => {
  let quickLinkViewModel: QuickLinkViewModel;
  let store: Store<DalState>;
  let dateMock: MockDate;

  const mockUserId = 186;
  const mockFavorites: FavoriteInterface[] = [
    new FavoriteFixture({
      id: 1,
      learningAreaId: 1,
      type: FavoriteTypesEnum.AREA,
      personId: mockUserId
    }),
    new FavoriteFixture({
      id: 2,
      learningAreaId: 2,
      eduContentId: 1,
      type: FavoriteTypesEnum.EDUCONTENT,
      personId: mockUserId
    }),
    new FavoriteFixture({
      id: 3,
      learningAreaId: 1,
      taskId: 1,
      type: FavoriteTypesEnum.TASK,
      personId: mockUserId
    }),
    new FavoriteFixture({
      id: 4,
      learningAreaId: 1,
      bundleId: 1,
      type: FavoriteTypesEnum.BUNDLE,
      personId: mockUserId
    }),
    new FavoriteFixture({
      id: 5,
      learningAreaId: 1,
      eduContentId: 2,
      type: FavoriteTypesEnum.BOEKE,
      personId: mockUserId
    }),
    new FavoriteFixture({
      id: 6,
      learningAreaId: 1,
      type: FavoriteTypesEnum.SEARCH,
      personId: mockUserId
    })
  ];
  const mockLearningAreas: LearningAreaInterface[] = [
    new LearningAreaFixture({ id: 1 }),
    new LearningAreaFixture({ id: 2 })
  ];
  const mockEduContents: EduContent[] = [
    new EduContentFixture({ id: 1, type: 'exercise' }),
    new EduContentFixture({ id: 2, type: 'boek-e' }),
    // userContent is always a link? -> can be used as mock for UserContent
    new EduContentFixture({ id: 3, type: 'link' }),
    new EduContentFixture({ id: 4, type: 'file' }),
    new EduContentFixture({ id: 5, type: 'paper-exercise' })
  ];
  const mockTasks: TaskInterface[] = [new TaskFixture({ id: 1 })];
  const mockBundles: BundleInterface[] = [new BundleFixture({ id: 1 })];

  const mockActions = [
    new DalActions.ActionSuccessful({
      successfulAction: 'test'
    }),
    new FavoriteActions.UpdateFavorite({
      userId: mockUserId,
      favorite: { changes: mockFavorites[0] } as Update<FavoriteInterface>
    }),
    new FavoriteActions.DeleteFavorite({
      id: mockFavorites[0].id,
      userId: mockUserId
      // handleErrorAutomatically: false
    })
  ];
  const mockFeedBack: {
    updateFavoriteError: EffectFeedbackInterface;
    deleteFavoriteError: EffectFeedbackInterface;
  } = {
    updateFavoriteError: new EffectFeedbackFixture({
      id: '1',
      triggerAction: mockActions[1] as FavoriteActions.UpdateFavorite, //UpdateFavorite
      message: 'This is a message',
      type: 'error',
      userActions: [
        {
          title: 'klik',
          userAction: mockActions[0]
        }
      ],
      timeStamp: 1,
      priority: Priority.HIGH,
      useDefaultCancel: false
    }),
    deleteFavoriteError: new EffectFeedbackFixture({
      id: '2',
      triggerAction: mockActions[2] as FavoriteActions.DeleteFavorite, //DeleteFavorite
      message: 'This is a message',
      type: 'error',
      userActions: [
        {
          title: 'klik',
          userAction: mockActions[0]
        }
      ],
      timeStamp: 2,
      priority: Priority.HIGH,
      useDefaultCancel: false
    })
  };

  beforeAll(() => {
    dateMock = new MockDate();
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          FavoriteReducer,
          LearningAreaReducer,
          EduContentReducer,
          TaskReducer,
          BundleReducer,
          EffectFeedbackReducer
        ])
      ],
      providers: [
        Store,
        QuickLinkViewModel,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } }
      ]
    });

    quickLinkViewModel = TestBed.get(QuickLinkViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(quickLinkViewModel).toBeDefined();
    });
  });

  describe('streams', () => {
    beforeEach(() => {
      hydrateStore();
    });

    describe('quickLinks', () => {
      it('should return quickLinks for favorites', () => {
        expect(
          quickLinkViewModel.getQuickLinks$(QuickLinkTypeEnum.FAVORITES)
        ).toBeObservable(
          hot('a', {
            a: [
              { ...mockFavorites[0], learningArea: mockLearningAreas[0] },
              {
                ...mockFavorites[1],
                learningArea: mockLearningAreas[1],
                eduContent: mockEduContents[0]
              },
              {
                ...mockFavorites[2],
                learningArea: mockLearningAreas[0],
                task: mockTasks[0]
              },
              {
                ...mockFavorites[3],
                learningArea: mockLearningAreas[0],
                bundle: mockBundles[0]
              },
              {
                ...mockFavorites[4],
                learningArea: mockLearningAreas[0],
                eduContent: mockEduContents[1]
              },
              {
                ...mockFavorites[5],
                learningArea: mockLearningAreas[0]
              }
            ] as FavoriteInterface[]
          })
        );
      });
    });

    describe('feedback', () => {
      it('should emit an error triggered by UpdateFavorite', () => {
        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack.updateFavoriteError
          })
        );

        expect(quickLinkViewModel.feedback$).toBeObservable(
          hot('a', { a: mockFeedBack.updateFavoriteError })
        );
      });

      it('should emit an error triggered by DeleteFavorite', () => {
        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack.deleteFavoriteError
          })
        );

        expect(quickLinkViewModel.feedback$).toBeObservable(
          hot('a', { a: mockFeedBack.deleteFavoriteError })
        );
      });
    });
  });

  function hydrateStore(): void {
    store.dispatch(
      new FavoriteActions.FavoritesLoaded({ favorites: mockFavorites })
    );
    store.dispatch(
      new LearningAreaActions.LearningAreasLoaded({
        learningAreas: mockLearningAreas
      })
    );
    store.dispatch(
      new EduContentActions.EduContentsLoaded({ eduContents: mockEduContents })
    );
    store.dispatch(new TaskActions.TasksLoaded({ tasks: mockTasks }));
    store.dispatch(new BundleActions.BundlesLoaded({ bundles: mockBundles }));
  }
  describe('action handlers', () => {
    it('should dispatch an update favorite action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const expectedAction = new FavoriteActions.UpdateFavorite({
        userId: 1,
        favorite: {
          id: 1,
          changes: { name: 'foo' }
        },
        customFeedbackHandlers: { useCustomErrorHandler: true }
      });
      quickLinkViewModel.update(1, 'foo', QuickLinkTypeEnum.FAVORITES);
      expect(spy).toHaveBeenCalledWith(expectedAction);
    });
    it('should dispatch a delete favorite action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const expectedAction = new FavoriteActions.DeleteFavorite({
        userId: 1,
        id: 1,
        customFeedbackHandlers: { useCustomErrorHandler: true }
      });
      quickLinkViewModel.delete(1, QuickLinkTypeEnum.FAVORITES);
      expect(spy).toHaveBeenCalledWith(expectedAction);
    });
    it('should not dispatch if the mode is not supported ', () => {
      const spy = jest.spyOn(store, 'dispatch');
      quickLinkViewModel.delete(1, 'bar' as QuickLinkTypeEnum);
      quickLinkViewModel.update(1, 'foo', 'bar' as QuickLinkTypeEnum);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
