import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
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
  HistoryActions,
  HistoryFixture,
  HistoryInterface,
  HistoryReducer,
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
import { Action, Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '../../services/content/open-static-content.interface';
import {
  FeedBackServiceInterface,
  FEEDBACK_SERVICE_TOKEN
} from '../../services/feedback';
import {
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '../../services/scorm/scorm-exercise.service.interface';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import {
  quickLinkActionDictionary,
  QuickLinkCategoryInterface,
  QuickLinkCategoryMap,
  QuickLinkInterface
} from './quick-link.interface';
import { QuickLinkViewModel } from './quick-link.viewmodel';

describe('QuickLinkViewModel', () => {
  let quickLinkViewModel: QuickLinkViewModel;
  let store: Store<DalState>;
  let router: Router;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let scormExerciseService: ScormExerciseServiceInterface;
  let feedBackService: FeedBackServiceInterface;
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
    }),
    new FavoriteFixture({
      id: 7,
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
        RouterTestingModule,
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          FavoriteReducer,
          LearningAreaReducer,
          EduContentReducer,
          TaskReducer,
          BundleReducer,
          EffectFeedbackReducer,
          HistoryReducer
        ])
      ],
      providers: [
        Store,
        QuickLinkViewModel,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        },
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useValue: { previewExerciseFromUnlockedContent: jest.fn() }
        },
        {
          provide: FEEDBACK_SERVICE_TOKEN,
          useValue: {
            addDefaultCancelButton: (val: EffectFeedbackInterface) => {
              return val;
            }
          }
        }
      ]
    });

    quickLinkViewModel = TestBed.get(QuickLinkViewModel);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
    feedBackService = TestBed.get(FEEDBACK_SERVICE_TOKEN);
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

    describe('getQuickLinkCategories$', () => {
      describe(' multiple quickLinks', () => {
        const quickLinkType = QuickLinkTypeEnum.FAVORITES;

        beforeEach(() => {
          store.dispatch(
            new FavoriteActions.FavoritesLoaded({ favorites: mockFavorites })
          );
        });

        it('should return quickLinks for favorites', () => {
          expect(
            quickLinkViewModel.getQuickLinkCategories$(quickLinkType, [
              FavoriteTypesEnum.TASK,
              FavoriteTypesEnum.EDUCONTENT,
              FavoriteTypesEnum.BUNDLE,
              FavoriteTypesEnum.BOEKE
            ])
          ).toBeObservable(
            hot('a', {
              a: [
                // mockFavorite[0] is not included -> learningArea favorites are filtered out

                // Exercise
                {
                  type: mockFavorites[1].type,
                  title: QuickLinkCategoryMap.get(mockFavorites[1].type).label,
                  order: QuickLinkCategoryMap.get(mockFavorites[1].type).order,
                  quickLinks: [
                    {
                      ...mockFavorites[1],
                      learningArea: mockLearningAreas[1],
                      eduContent: mockEduContents[0],
                      task: undefined,
                      bundle: undefined,
                      defaultAction:
                        quickLinkActionDictionary.openEduContentAsExercise,
                      alternativeOpenActions: [
                        quickLinkActionDictionary.openEduContentAsSolution
                      ],
                      manageActions: [
                        quickLinkActionDictionary.edit,
                        quickLinkActionDictionary.remove
                      ]
                    }
                  ]
                },
                // Task
                {
                  type: mockFavorites[2].type,
                  title: QuickLinkCategoryMap.get(mockFavorites[2].type).label,
                  order: QuickLinkCategoryMap.get(mockFavorites[2].type).order,
                  quickLinks: [
                    {
                      ...mockFavorites[2],
                      learningArea: mockLearningAreas[0],
                      task: mockTasks[0],
                      eduContent: undefined,
                      bundle: undefined,
                      defaultAction: quickLinkActionDictionary.openTask,
                      alternativeOpenActions: [],
                      manageActions: [
                        quickLinkActionDictionary.edit,
                        quickLinkActionDictionary.remove
                      ]
                    }
                  ]
                },
                // Bundle
                {
                  type: mockFavorites[3].type,
                  title: QuickLinkCategoryMap.get(mockFavorites[3].type).label,
                  order: QuickLinkCategoryMap.get(mockFavorites[3].type).order,
                  quickLinks: [
                    {
                      ...mockFavorites[3],
                      learningArea: mockLearningAreas[0],
                      bundle: mockBundles[0],
                      eduContent: undefined,
                      task: undefined,
                      defaultAction: quickLinkActionDictionary.openBundle,
                      alternativeOpenActions: [],
                      manageActions: [
                        quickLinkActionDictionary.edit,
                        quickLinkActionDictionary.remove
                      ]
                    }
                  ]
                },
                // Boek-e
                {
                  type: mockFavorites[4].type,
                  title: QuickLinkCategoryMap.get(mockFavorites[4].type).label,
                  order: QuickLinkCategoryMap.get(mockFavorites[4].type).order,
                  quickLinks: [
                    {
                      ...mockFavorites[4],
                      learningArea: mockLearningAreas[0],
                      eduContent: mockEduContents[1],
                      task: undefined,
                      bundle: undefined,
                      defaultAction: quickLinkActionDictionary.openBoeke,
                      alternativeOpenActions: [],
                      manageActions: [
                        quickLinkActionDictionary.edit,
                        quickLinkActionDictionary.remove
                      ]
                    }
                  ]
                },
                // Search
                {
                  type: mockFavorites[5].type,
                  title: QuickLinkCategoryMap.get(mockFavorites[5].type).label,
                  order: QuickLinkCategoryMap.get(mockFavorites[5].type).order,
                  quickLinks: [
                    {
                      ...mockFavorites[5],
                      learningArea: mockLearningAreas[0],
                      eduContent: undefined,
                      task: undefined,
                      bundle: undefined,
                      defaultAction: quickLinkActionDictionary.openSearch,
                      alternativeOpenActions: [],
                      manageActions: [
                        quickLinkActionDictionary.edit,
                        quickLinkActionDictionary.remove
                      ]
                    },
                    {
                      ...mockFavorites[6],
                      learningArea: mockLearningAreas[0],
                      eduContent: undefined,
                      task: undefined,
                      bundle: undefined,
                      defaultAction: quickLinkActionDictionary.openSearch,
                      alternativeOpenActions: [],
                      manageActions: [
                        quickLinkActionDictionary.edit,
                        quickLinkActionDictionary.remove
                      ]
                    }
                  ]
                }
              ] as QuickLinkCategoryInterface[]
            })
          );
        });
      });

      describe('individual quickLink', () => {
        let quickLinkCategory$: Observable<QuickLinkCategoryInterface>;
        let quickLink$: Observable<QuickLinkInterface>;

        const testCasesFavorites = [
          {
            describeName: 'favorite - bundle',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.FAVORITES,
              quickLinkType: FavoriteTypesEnum.BUNDLE
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.BUNDLE).label,
                type: FavoriteTypesEnum.BUNDLE,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.BUNDLE).order
              },
              defaultAction: quickLinkActionDictionary.openBundle,
              alternativeOpenActions: [],
              manageActions: [
                quickLinkActionDictionary.edit,
                quickLinkActionDictionary.remove
              ]
            }
          },
          {
            describeName: 'favorite - task',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.FAVORITES,
              quickLinkType: FavoriteTypesEnum.TASK
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.TASK).label,
                type: FavoriteTypesEnum.TASK,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.TASK).order
              },
              defaultAction: quickLinkActionDictionary.openTask,
              alternativeOpenActions: [],
              manageActions: [
                quickLinkActionDictionary.edit,
                quickLinkActionDictionary.remove
              ]
            }
          },
          {
            describeName: 'favorite - search',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.FAVORITES,
              quickLinkType: FavoriteTypesEnum.SEARCH
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.SEARCH).label,
                type: FavoriteTypesEnum.SEARCH,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.SEARCH).order
              },
              defaultAction: quickLinkActionDictionary.openSearch,
              alternativeOpenActions: [],
              manageActions: [
                quickLinkActionDictionary.edit,
                quickLinkActionDictionary.remove
              ]
            }
          },
          {
            describeName: 'favorite - boek-e',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.FAVORITES,
              quickLinkType: FavoriteTypesEnum.BOEKE
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.BOEKE).label,
                type: FavoriteTypesEnum.BOEKE,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.BOEKE).order
              },
              defaultAction: quickLinkActionDictionary.openBoeke,
              alternativeOpenActions: [],
              manageActions: [
                quickLinkActionDictionary.edit,
                quickLinkActionDictionary.remove
              ]
            }
          },
          {
            describeName: 'favorite - eduContent - exercise',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.FAVORITES,
              quickLinkType: FavoriteTypesEnum.EDUCONTENT,
              eduContentType: 'exercise'
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .label,
                type: FavoriteTypesEnum.EDUCONTENT,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .order
              },
              defaultAction: quickLinkActionDictionary.openEduContentAsExercise,
              alternativeOpenActions: [
                quickLinkActionDictionary.openEduContentAsSolution
              ],
              manageActions: [
                quickLinkActionDictionary.edit,
                quickLinkActionDictionary.remove
              ]
            }
          },
          {
            describeName:
              'favorite - eduContent - not an exercise - streamable',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.FAVORITES,
              quickLinkType: FavoriteTypesEnum.EDUCONTENT,
              eduContentType: 'not an exercise',
              eduContentStreamAble: true
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .label,
                type: FavoriteTypesEnum.EDUCONTENT,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .order
              },
              defaultAction: quickLinkActionDictionary.openEduContentAsStream,
              alternativeOpenActions: [
                quickLinkActionDictionary.openEduContentAsDownload
              ],
              manageActions: [
                quickLinkActionDictionary.edit,
                quickLinkActionDictionary.remove
              ]
            }
          },
          {
            describeName:
              'favorite - eduContent - not an exercise - not streamable',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.FAVORITES,
              quickLinkType: FavoriteTypesEnum.EDUCONTENT,
              eduContentType: 'not an exercise',
              eduContentStreamAble: false
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .label,
                type: FavoriteTypesEnum.EDUCONTENT,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .order
              },
              defaultAction: quickLinkActionDictionary.openEduContentAsDownload,
              alternativeOpenActions: [],
              manageActions: [
                quickLinkActionDictionary.edit,
                quickLinkActionDictionary.remove
              ]
            }
          }
        ];

        const testCasesHistory = [
          {
            describeName: 'history - bundle',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.HISTORY,
              quickLinkType: FavoriteTypesEnum.BUNDLE
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.BUNDLE).label,
                type: FavoriteTypesEnum.BUNDLE,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.BUNDLE).order
              },
              defaultAction: quickLinkActionDictionary.openBundle,
              alternativeOpenActions: [],
              manageActions: [quickLinkActionDictionary.remove]
            }
          },
          {
            describeName: 'history - task',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.HISTORY,
              quickLinkType: FavoriteTypesEnum.TASK
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.TASK).label,
                type: FavoriteTypesEnum.TASK,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.TASK).order
              },
              defaultAction: quickLinkActionDictionary.openTask,
              alternativeOpenActions: [],
              manageActions: [quickLinkActionDictionary.remove]
            }
          },
          {
            describeName: 'history - search',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.HISTORY,
              quickLinkType: FavoriteTypesEnum.SEARCH
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.SEARCH).label,
                type: FavoriteTypesEnum.SEARCH,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.SEARCH).order
              },
              defaultAction: quickLinkActionDictionary.openSearch,
              alternativeOpenActions: [],
              manageActions: [quickLinkActionDictionary.remove]
            }
          },
          {
            describeName: 'history - boeke',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.HISTORY,
              quickLinkType: FavoriteTypesEnum.BOEKE
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.BOEKE).label,
                type: FavoriteTypesEnum.BOEKE,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.BOEKE).order
              },
              defaultAction: quickLinkActionDictionary.openBoeke,
              alternativeOpenActions: [],
              manageActions: [quickLinkActionDictionary.remove]
            }
          },
          {
            describeName: 'history - eduContent - exercise',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.HISTORY,
              quickLinkType: FavoriteTypesEnum.EDUCONTENT,
              eduContentType: 'exercise'
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .label,
                type: FavoriteTypesEnum.EDUCONTENT,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .order
              },
              defaultAction: quickLinkActionDictionary.openEduContentAsExercise,
              alternativeOpenActions: [
                quickLinkActionDictionary.openEduContentAsSolution
              ],
              manageActions: [quickLinkActionDictionary.remove]
            }
          },
          {
            describeName: 'history - eduContent - not an exercise - streamable',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.HISTORY,
              quickLinkType: FavoriteTypesEnum.EDUCONTENT,
              eduContentType: 'not an exercise',
              eduContentStreamAble: true
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .label,
                type: FavoriteTypesEnum.EDUCONTENT,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .order
              },
              defaultAction: quickLinkActionDictionary.openEduContentAsStream,
              alternativeOpenActions: [
                quickLinkActionDictionary.openEduContentAsDownload
              ],
              manageActions: [quickLinkActionDictionary.remove]
            }
          },
          {
            describeName:
              'history - eduContent - not an exercise - not streamable',
            setup: {
              quickLinkDataMode: QuickLinkTypeEnum.HISTORY,
              quickLinkType: FavoriteTypesEnum.EDUCONTENT,
              eduContentType: 'not an exercise',
              eduContentStreamAble: false
            },
            expected: {
              category: {
                title: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .label,
                type: FavoriteTypesEnum.EDUCONTENT,
                order: QuickLinkCategoryMap.get(FavoriteTypesEnum.EDUCONTENT)
                  .order
              },
              defaultAction: quickLinkActionDictionary.openEduContentAsDownload,
              alternativeOpenActions: [],
              manageActions: [quickLinkActionDictionary.remove]
            }
          }
        ];

        [...testCasesFavorites, ...testCasesHistory].forEach(testCase => {
          describe('(' + testCase.describeName + ')', () => {
            let mockStoreObject: FavoriteInterface | HistoryInterface;
            let mockEduContent: EduContent;

            beforeEach(() => {
              // specific setup for eduContent
              // create appropriate fixture and load in Store
              if (testCase.setup.eduContentType) {
                mockEduContent = new EduContentFixture(
                  {
                    type: testCase.setup.eduContentType
                  },
                  {
                    streamable: !!testCase.setup.eduContentStreamAble
                  }
                );

                store.dispatch(
                  new EduContentActions.EduContentsLoaded({
                    eduContents: [mockEduContent]
                  })
                );
              }

              // create appropriate fixture and load in Store
              switch (testCase.setup.quickLinkDataMode) {
                case QuickLinkTypeEnum.FAVORITES:
                  mockStoreObject = new FavoriteFixture({
                    type: testCase.setup.quickLinkType,
                    eduContentId: testCase.setup.eduContentType
                      ? mockEduContent.id
                      : undefined
                  });

                  store.dispatch(
                    new FavoriteActions.FavoritesLoaded({
                      favorites: [mockStoreObject]
                    })
                  );
                  break;
                case QuickLinkTypeEnum.HISTORY:
                  mockStoreObject = new HistoryFixture({
                    type: testCase.setup.quickLinkType,
                    eduContentId: testCase.setup.eduContentType
                      ? mockEduContent.id
                      : undefined
                  });

                  store.dispatch(
                    new HistoryActions.HistoryLoaded({
                      history: [mockStoreObject]
                    })
                  );
                  break;
              }

              // isolate category of item under test
              quickLinkCategory$ = quickLinkViewModel
                .getQuickLinkCategories$(testCase.setup.quickLinkDataMode, [
                  FavoriteTypesEnum.EDUCONTENT
                ])
                .pipe(
                  map(
                    // only 1 item in the store
                    quickLinkCategories => quickLinkCategories[0]
                  )
                );

              // isolate item under test
              quickLink$ = quickLinkCategory$.pipe(
                map(
                  // only 1 item in the category
                  quickLinkCategory => quickLinkCategory.quickLinks[0]
                )
              );
            });

            describe('category', () => {
              it('should have the correct type', () => {
                const expected = jasmine.objectContaining({
                  type: testCase.expected.category.type
                });
                expect(quickLinkCategory$).toBeObservable(
                  hot('a', { a: expected })
                );
              });

              it('should have the correct title', () => {
                const expected = jasmine.objectContaining({
                  title: testCase.expected.category.title
                });
                expect(quickLinkCategory$).toBeObservable(
                  hot('a', { a: expected })
                );
              });

              it('should have the correct order', () => {
                const expected = jasmine.objectContaining({
                  order: testCase.expected.category.order
                });
                expect(quickLinkCategory$).toBeObservable(
                  hot('a', { a: expected })
                );
              });
            });

            describe('open actions', () => {
              it('should add a defaultAction', () => {
                const expected = jasmine.objectContaining({
                  ...mockStoreObject,
                  defaultAction: testCase.expected.defaultAction
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });

              it('should add alternativeOpenActions', () => {
                const expected = jasmine.objectContaining({
                  ...mockStoreObject,
                  alternativeOpenActions:
                    testCase.expected.alternativeOpenActions
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });
            });

            describe('manage actions', () => {
              it('should add manageActions', () => {
                const expected = jasmine.objectContaining({
                  ...mockStoreObject,
                  manageActions: testCase.expected.manageActions
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });
            });
          });
        });
      });
    });

    describe('feedback', () => {
      it('should emit an error triggered by UpdateFavorite', () => {
        const spy = jest.spyOn(feedBackService, 'addDefaultCancelButton');
        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack.updateFavoriteError
          })
        );
        expect(quickLinkViewModel.getFeedback$()).toBeObservable(
          hot('a', { a: mockFeedBack.updateFavoriteError })
        );
        expect(spy).toHaveBeenCalledWith(mockFeedBack.updateFavoriteError);
      });

      it('should emit an error triggered by DeleteFavorite', () => {
        const spy = jest.spyOn(feedBackService, 'addDefaultCancelButton');

        store.dispatch(
          new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: mockFeedBack.deleteFavoriteError
          })
        );

        expect(quickLinkViewModel.getFeedback$()).toBeObservable(
          hot('a', { a: mockFeedBack.deleteFavoriteError })
        );

        expect(spy).toHaveBeenCalledWith(mockFeedBack.deleteFavoriteError);
      });
    });
  });

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
      quickLinkViewModel.remove(1, QuickLinkTypeEnum.FAVORITES);
      expect(spy).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch a delete history action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const expectedAction = new HistoryActions.DeleteHistory({
        id: 1,
        userId: 1,
        customFeedbackHandlers: { useCustomErrorHandler: true }
      });
      quickLinkViewModel.remove(1, QuickLinkTypeEnum.HISTORY);
      expect(spy).toHaveBeenCalledWith(expectedAction);
    });

    it('should not dispatch if the mode is not supported ', () => {
      const spy = jest.spyOn(store, 'dispatch');
      quickLinkViewModel.remove(1, 'bar' as QuickLinkTypeEnum);
      quickLinkViewModel.update(1, 'foo', 'bar' as QuickLinkTypeEnum);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should handle feedback dismiss with action', () => {
      const spy = jest.spyOn(store, 'dispatch').mockImplementation(() => {});
      const feedbackDismissEvent = {
        action: {} as Action,
        feedbackId: 'foo'
      };
      quickLinkViewModel.onFeedbackDismiss(feedbackDismissEvent);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(feedbackDismissEvent.action);
      expect(spy).toHaveBeenCalledWith(
        new EffectFeedbackActions.DeleteEffectFeedback({ id: 'foo' })
      );
    });
    it('should handle feedback dismiss without action', () => {
      const spy = jest.spyOn(store, 'dispatch').mockImplementation(() => {});
      const feedbackDismissEvent = {
        action: null,
        feedbackId: 'foo'
      };
      quickLinkViewModel.onFeedbackDismiss(feedbackDismissEvent);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        new EffectFeedbackActions.DeleteEffectFeedback({ id: 'foo' })
      );
    });
  });

  describe('open eduContent', () => {
    it('should navigate to the bundle', () => {
      const bundle = new BundleFixture({
        id: 4,
        learningAreaId: 7
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openBundle(bundle);

      expect(router.navigate).toHaveBeenCalledWith([
        '/bundles',
        bundle.learningAreaId,
        bundle.id
      ]);
    });

    it('should navigate to the task', () => {
      const task = new TaskFixture({
        id: 4,
        learningAreaId: 7
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openTask(task);

      expect(router.navigate).toHaveBeenCalledWith([
        '/tasks',
        task.learningAreaId,
        task.id
      ]);
    });

    it('should navigate to the learningarea', () => {
      const area = new LearningAreaFixture({
        id: 4
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openArea(area);

      expect(router.navigate).toHaveBeenCalledWith(['/edu-content', area.id]);
    });

    it('should open eduContent', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      quickLinkViewModel.openStaticContent(eduContent);

      expect(spy).toHaveBeenCalledWith(eduContent, undefined);
    });

    it('should open eduContent as a stream', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(openStaticContentService, 'open');

      quickLinkViewModel.openStaticContent(eduContent, true);

      expect(spy).toHaveBeenCalledWith(eduContent, true);
    });

    it('should open an exercise', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(
        scormExerciseService,
        'previewExerciseFromUnlockedContent'
      );

      quickLinkViewModel.openExercise(eduContent);

      expect(spy).toHaveBeenCalledWith(null, eduContent.id, null, false);
    });

    it('should open an exercise with solutions', () => {
      const eduContent = new EduContentFixture({
        id: 4
      });
      const spy = jest.spyOn(
        scormExerciseService,
        'previewExerciseFromUnlockedContent'
      );

      quickLinkViewModel.openExercise(eduContent, true);

      expect(spy).toHaveBeenCalledWith(null, eduContent.id, null, true);
    });

    it('should open the searchterm page with favorite_id', () => {
      const favorite = new FavoriteFixture({
        id: 4,
        learningAreaId: 7
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openSearch(favorite, QuickLinkTypeEnum.FAVORITES);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/edu-content', favorite.learningAreaId, 'term'],
        { queryParams: { favorite_id: favorite.id } }
      );
    });

    it('should open the searchterm page with history_id', () => {
      const history = new HistoryFixture({
        id: 4,
        learningAreaId: 7
      });
      router.navigate = jest.fn();

      quickLinkViewModel.openSearch(history, QuickLinkTypeEnum.HISTORY);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/edu-content', history.learningAreaId, 'term'],
        { queryParams: { history_id: history.id } }
      );
    });
  });

  function hydrateStore(): void {
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
});
