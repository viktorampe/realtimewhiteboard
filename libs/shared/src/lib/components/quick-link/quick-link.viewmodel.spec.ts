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
  HistoryInterface,
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
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '../../content/open-static-content.interface';
import {
  FeedBackServiceInterface,
  FEEDBACK_SERVICE_TOKEN
} from '../../feedback';
import {
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '../../scorm/scorm-exercise.service.interface';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
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
          EffectFeedbackReducer
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

    describe('quickLinks', () => {
      describe('for favorites', () => {
        const quickLinkType = QuickLinkTypeEnum.FAVORITES;
        xit('should return quickLinks for favorites', () => {
          expect(
            quickLinkViewModel.getQuickLinkCategories$(quickLinkType)
          ).toBeObservable(
            hot('a', {
              a: [
                // mockFavorite[0] is not included -> learningArea favorites are filtered out
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

      xdescribe('actions on a quickLink', () => {
        let quickLinkActions;
        let quickLink$;

        beforeEach(() => {
          // replace functions that should be added as handlers with mocks
          // tests need same instance reference
          // there are other tests to check if clicks call the correct handler
          quickLinkActions = quickLinkViewModel['quickLinkActions'];
        });

        describe('open actions', () => {
          describe('type: area', () => {
            const mockOpenAreaFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.AREA
            });

            beforeEach(() => {
              quickLinkActions.openArea.handler = mockOpenAreaFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'lesmateriaal',
                tooltip: 'Navigeer naar de leergebied pagina',
                handler: mockOpenAreaFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: bundle', () => {
            const mockOpenBundleFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.BUNDLE
            });

            beforeEach(() => {
              quickLinkActions.openBundle.handler = mockOpenBundleFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'bundle',
                tooltip: 'Navigeer naar de bundel pagina',
                handler: mockOpenBundleFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: task', () => {
            const mockOpenTaskFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.TASK
            });

            beforeEach(() => {
              quickLinkActions.openTask.handler = mockOpenTaskFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'task',
                tooltip: 'Navigeer naar de taken pagina',
                handler: mockOpenTaskFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: boeke-e', () => {
            const mockOpenBoekeFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.BOEKE
            });

            beforeEach(() => {
              quickLinkActions.openBoeke.handler = mockOpenBoekeFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'boeken',
                tooltip: 'Open het bordboek',
                handler: mockOpenBoekeFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: search', () => {
            const mockOpenSearchFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.SEARCH
            });

            beforeEach(() => {
              quickLinkActions.openSearch.handler = mockOpenSearchFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'magnifier',
                tooltip: 'Open de zoekopdracht',
                handler: mockOpenSearchFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should not add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: eduContent - exercise', () => {
            const mockOpenEduContentAsExerciseFunction = () => {};
            const mockOpenEduContentAsSolutionFunction = () => {};
            const mockFavorite = new FavoriteFixture({
              type: FavoriteTypesEnum.EDUCONTENT,
              eduContent: new EduContentFixture({ type: 'exercise' })
            });

            beforeEach(() => {
              quickLinkActions.openEduContentAsExercise.handler = mockOpenEduContentAsExerciseFunction;
              quickLinkActions.openEduContentAsSolution.handler = mockOpenEduContentAsSolutionFunction;
              vmQuickLinks$.next([mockFavorite]);
              fixture.detectChanges();

              // only 1 category with 1 quickLink
              quickLink$ = component.filterTextInput.result$.pipe(
                map(cD => cD[0].quickLinks[0])
              );
            });

            it('should add a defaultAction', () => {
              const expectedDefaultAction = {
                actionType: 'open',
                label: 'Openen',
                icon: 'exercise:open',
                tooltip: 'Open oefening zonder oplossingen',
                handler: mockOpenEduContentAsExerciseFunction
              };

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                defaultAction: expectedDefaultAction
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });

            it('should add alternativeOpenActions', () => {
              const expectedAlternativeOpenActions = [
                {
                  actionType: 'open',
                  label: 'Toon oplossing',
                  icon: 'exercise:finished',
                  tooltip: 'Open oefening met oplossingen',
                  handler: mockOpenEduContentAsSolutionFunction
                }
              ];

              const expected = jasmine.objectContaining({
                ...mockFavorite,
                alternativeOpenActions: expectedAlternativeOpenActions
              });

              expect(quickLink$).toBeObservable(hot('a', { a: expected }));
            });
          });

          describe('type: eduContent - not an exercise', () => {
            const mockOpenEduContentAsStreamFunction = () => {};
            const mockOpenEduContentAsDownloadFunction = () => {};
            let mockFavorite: FavoriteInterface;

            beforeEach(() => {
              quickLinkActions.openEduContentAsStream.handler = mockOpenEduContentAsStreamFunction;
              quickLinkActions.openEduContentAsDownload.handler = mockOpenEduContentAsDownloadFunction;
            });

            describe('eduContent is streamable', () => {
              beforeEach(() => {
                mockFavorite = new FavoriteFixture({
                  type: FavoriteTypesEnum.EDUCONTENT,
                  eduContent: new EduContentFixture(
                    {
                      type: 'not an exercise'
                    },
                    new EduContentMetadataFixture({ streamable: true })
                  )
                });

                vmQuickLinks$.next([mockFavorite]);
                fixture.detectChanges();

                // only 1 category with 1 quickLink
                quickLink$ = component.filterTextInput.result$.pipe(
                  map(cD => cD[0].quickLinks[0])
                );
              });

              it('should add a defaultAction', () => {
                const expectedDefaultAction = {
                  actionType: 'open',
                  label: 'Openen',
                  icon: 'lesmateriaal',
                  tooltip: 'Open het lesmateriaal',
                  handler: mockOpenEduContentAsStreamFunction
                };

                const expected = jasmine.objectContaining({
                  ...mockFavorite,
                  defaultAction: expectedDefaultAction
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });

              it('should add alternativeOpenActions', () => {
                const expectedAlternativeOpenActions = [
                  {
                    actionType: 'open',
                    label: 'Downloaden',
                    icon: 'download',
                    tooltip: 'Download het lesmateriaal',
                    handler: mockOpenEduContentAsDownloadFunction
                  }
                ];

                const expected = jasmine.objectContaining({
                  ...mockFavorite,
                  alternativeOpenActions: expectedAlternativeOpenActions
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });
            });

            describe('eduContent is not streamable', () => {
              beforeEach(() => {
                mockFavorite = new FavoriteFixture({
                  type: FavoriteTypesEnum.EDUCONTENT,
                  eduContent: new EduContentFixture(
                    {
                      type: 'not an exercise'
                    },
                    new EduContentMetadataFixture({ streamable: false })
                  )
                });

                vmQuickLinks$.next([mockFavorite]);
                fixture.detectChanges();

                // only 1 category with 1 quickLink
                quickLink$ = component.filterTextInput.result$.pipe(
                  map(cD => cD[0].quickLinks[0])
                );
              });

              it('should add a defaultAction', () => {
                const expectedDefaultAction = {
                  actionType: 'open',
                  label: 'Downloaden',
                  icon: 'download',
                  tooltip: 'Download het lesmateriaal',
                  handler: mockOpenEduContentAsDownloadFunction
                };

                const expected = jasmine.objectContaining({
                  ...mockFavorite,
                  defaultAction: expectedDefaultAction
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });

              it('should not add alternativeOpenActions', () => {
                const expectedAlternativeOpenActions = [];

                const expected = jasmine.objectContaining({
                  ...mockFavorite,
                  alternativeOpenActions: expectedAlternativeOpenActions
                });

                expect(quickLink$).toBeObservable(hot('a', { a: expected }));
              });
            });
          });
        });

        describe('manage actions', () => {
          const mockUpdateFunction = () => {};
          const mockRemoveFunction = () => {};
          let mockFavorite;

          beforeEach(() => {
            // replace functions that should be added as handlers with mocks
            // tests need same instance reference
            // there are other tests to check if clicks call the correct handler
            quickLinkActions.edit.handler = mockUpdateFunction;
            quickLinkActions.remove.handler = mockRemoveFunction;

            mockFavorite = new FavoriteFixture({ type: 'task' });
            vmQuickLinks$.next([mockFavorite]);
            fixture.detectChanges();

            // only 1 category with 1 quickLink
            quickLink$ = component.filterTextInput.result$.pipe(
              map(cD => cD[0].quickLinks[0])
            );
          });

          it('should add manageActions', () => {
            const expectedManageActions = [
              {
                actionType: 'manage',
                label: 'Bewerken',
                icon: 'edit',
                tooltip: 'Pas de naam van het item aan',
                handler: mockUpdateFunction
              },
              {
                actionType: 'manage',
                label: 'Verwijderen',
                icon: 'delete',
                tooltip: 'Verwijder het item',
                handler: mockRemoveFunction
              }
            ];

            const expected = jasmine.objectContaining({
              ...mockFavorite,
              manageActions: expectedManageActions
            });

            expect(quickLink$).toBeObservable(hot('a', { a: expected }));
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
      quickLinkViewModel.remove(1, QuickLinkTypeEnum.FAVORITES);
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
      // TODO replace FavoriteFixture with HistoryFixture when available
      const history = new FavoriteFixture({
        id: 4,
        learningAreaId: 7
      }) as HistoryInterface;
      router.navigate = jest.fn();

      quickLinkViewModel.openSearch(history, QuickLinkTypeEnum.HISTORY);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/edu-content', history.learningAreaId, 'term'],
        { queryParams: { history_id: history.id } }
      );
    });
  });
});
