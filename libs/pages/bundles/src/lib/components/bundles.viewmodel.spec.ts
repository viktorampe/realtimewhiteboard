import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  BundleActions,
  BundleFixture,
  BundleInterface,
  BundleReducer,
  DalState,
  EduContentInterface,
  EduContentMetadataFixture,
  EduContentMetadataInterface,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  PersonFixture,
  StateFeatureBuilder,
  UnlockedBoekeStudentFixture,
  UnlockedContentFixture,
  UnlockedContentInterface,
  UserActions,
  UserReducer
} from '@campus/dal';
import { PersonInterface } from '@diekeure/polpo-api-angular-sdk';
import { Dictionary } from '@ngrx/entity';
import {
  ActionsSubject,
  ReducerManager,
  StateObservable,
  Store,
  StoreModule
} from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { BehaviorSubject, Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { BundlesViewModel } from './bundles.viewmodel';

@Injectable()
export class MockStore extends Store<DalState> {
  private stateSubject = new BehaviorSubject<DalState>(createState());

  constructor(
    state$: StateObservable,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager
  ) {
    super(state$, actionsObserver, reducerManager);
    this.source = this.stateSubject.asObservable();
  }

  setState(nextState: DalState) {
    this.stateSubject.next(nextState);
  }
}

describe('BundlesViewModel', () => {
  let store: MockStore;
  let bundlesViewModel: BundlesViewModel;
  let usedUserState: any;
  let usedLearningAreaState: any;
  let usedBundleState: any;
  let unlockedBoekeGroupState: any;
  let unlockedBoekeStudentState: any;

  afterEach(() => {
    jest.clearAllMocks();
    usedUserState = {};
    usedLearningAreaState = [];
    usedBundleState = [];
    unlockedBoekeGroupState = [];
    unlockedBoekeStudentState = [];
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          {
            NAME: UserReducer.NAME,
            reducer: UserReducer.reducer,
            initialState: {
              initialState: usedUserState
            }
          },
          {
            NAME: LearningAreaReducer.NAME,
            reducer: LearningAreaReducer.reducer,
            initialState: {
              initialState: usedLearningAreaState
            }
          },
          {
            NAME: BundleReducer.NAME,
            reducer: BundleReducer.reducer,
            initialState: {
              initialState: usedBundleState
            }
          }
        ])
      ],
      // schemas: [NO_ERRORS_SCHEMA],
      providers: [
        BundlesViewModel,
        // { provide: Store, useClass: MockStore },
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: {} }
      ]
    });

    bundlesViewModel = TestBed.get(BundlesViewModel);
    // store = TestBed.get(Store);
  });

  it('should be defined', () => {
    expect(bundlesViewModel).toBeDefined();
  });

  describe('sharedLearningAreas$', () => {
    let user: PersonInterface;
    let learningAreas: LearningAreaInterface[];
    let sharedBundles: BundleInterface[];

    beforeAll(() => {
      user = { id: 1, email: 'email expected' };
      usedUserState = UserReducer.reducer(
        UserReducer.initialState,
        new UserActions.UserLoaded(user)
      );

      learningAreas = [
        new LearningAreaFixture({ id: 1 }),
        new LearningAreaFixture({ id: 2 }),
        new LearningAreaFixture({ id: 3 }),
        new LearningAreaFixture({ id: 4 }),
        new LearningAreaFixture({ id: 5 })
      ];
      usedLearningAreaState = LearningAreaReducer.reducer(
        LearningAreaReducer.initialState,
        new LearningAreaActions.LearningAreasLoaded({
          learningAreas: learningAreas
        })
      );

      sharedBundles = [
        new BundleFixture({ id: 1, teacherId: 2, learningAreaId: 1 }),
        new BundleFixture({ id: 1, teacherId: 2, learningAreaId: 2 }),
        new BundleFixture({ id: 1, teacherId: 2, learningAreaId: 3 })
      ];
      usedBundleState = BundleReducer.reducer(
        BundleReducer.initialState,
        new BundleActions.BundlesLoaded({
          bundles: sharedBundles
        })
      );
    });

    it('observable', () => {
      expect(bundlesViewModel.sharedLearningAreas$).toBeObservable(
        hot('a', { a: learningAreas })
      );
    });

    // const sharedLearningAreas$ = bundlesViewModel.sharedLearningAreas$.subscribe(
    //   (learningAreasInfo: LearningAreasWithBundlesInfoInterface): void => {
    //     expect(learningAreasInfo).toEqual({
    //       learningAreas: {
    //         learningAreas: [],
    //         bundleCount: 0,
    //         bookCount: 0
    //       }
    //     });
    //   }
    // );

    // store.setState(
    //   createState({
    //     learningAreas: entityStore([
    //       new LearningAreaFixture({ id: 1 }),
    //       new LearningAreaFixture({ id: 2 }),
    //       new LearningAreaFixture({ id: 3 }),
    //       new LearningAreaFixture({ id: 4 }),
    //       new LearningAreaFixture({ id: 5 })
    //     ]),

    //     bundles: entityStore([
    //       new BundleFixture({ id: 1, learningAreaId: 1, teacherId: 1 }),
    //       new BundleFixture({ id: 2, learningAreaId: 1, teacherId: 1 }),
    //       new BundleFixture({ id: 3, learningAreaId: 1, teacherId: 1 }),
    //       new BundleFixture({ id: 4, learningAreaId: 2, teacherId: 1 }),
    //       new BundleFixture({ id: 5, learningAreaId: 2, teacherId: 1 }),
    //       new BundleFixture({ id: 6, learningAreaId: 2, teacherId: 1 }),
    //       new BundleFixture({ id: 7, learningAreaId: 3, teacherId: 1 }),
    //       new BundleFixture({ id: 8, learningAreaId: 3, teacherId: 1 }),
    //       new BundleFixture({ id: 9, learningAreaId: 3, teacherId: 1 })
    //     ])
    //   })
    // );

    // expect(bundlesViewModel.sharedLearningAreas$).toBeObservable(
    //   hot('a|', {
    //     a: []
    //   })
    // );
  });

  it(
    'getLearningAreaBundles()',
    marbles(m => {
      const learningAreaId$ = m.hot('--a--b|', {
        a: 1,
        b: 2
      });
      const bundlesByLearningArea$ = m.hot('-a----|', {
        a: bundlesByLearningArea
      });
      const result = '--a--b|';

      const result$: Observable<BundleInterface[]> = bundlesViewModel[
        'getLearningAreaBundles'
      ](learningAreaId$, bundlesByLearningArea$);
      m.expect(result$).toBeObservable(result, {
        a: bundlesByLearningArea[1],
        b: bundlesByLearningArea[2]
      });
    })
  );

  it(
    'getLearningAreaBooks()',
    marbles(m => {
      const learningAreaId$ = m.hot('--a--b|', {
        a: 1,
        b: 2
      });
      const booksByLearningArea$ = m.hot('--a---|', {
        a: booksMetaDataByLearningArea
      });
      const result = '--a--b|';

      const result$: Observable<
        EduContentMetadataInterface[]
      > = bundlesViewModel['getLearningAreaBooks'](
        learningAreaId$,
        booksByLearningArea$ //TODO typing needs to be fixed
      );
      m.expect(result$).toBeObservable(result, {
        a: booksMetaDataByLearningArea[1],
        b: booksMetaDataByLearningArea[2]
      });
    })
  );

  it('getBundleContentsCount()', () => {
    const unlockedContentByBundle$: Observable<
      Dictionary<UnlockedContentInterface[]>
    > = hot('a-|', {
      a: {
        1: [
          new UnlockedContentFixture({ index: 1, id: 1, bundleId: 1 }),
          new UnlockedContentFixture({ index: 2, id: 2, bundleId: 1 }),
          new UnlockedContentFixture({ index: 3, id: 3, bundleId: 1 })
        ],
        2: [
          new UnlockedContentFixture({ index: 10, id: 10, bundleId: 2 }),
          new UnlockedContentFixture({ index: 20, id: 20, bundleId: 2 })
        ]
      }
    });
    expect(
      bundlesViewModel['getBundleContentsCount'](unlockedContentByBundle$)
    ).toBeObservable(hot('a-|', { a: { 1: 3, 2: 2 } }));
  });

  // it('getBundleContents()', () => {
  //   return;
  // });

  // it('getSharedBooks()', () => {
  //   return;
  // });

  it('getLearningAreaIdsWithContent()', () => {
    const bundles$: Observable<BundleInterface[]> = hot('-a-|', {
      a: [
        new BundleFixture({ id: 1, learningAreaId: 1 }),
        new BundleFixture({ id: 2, learningAreaId: 1 }),
        new BundleFixture({ id: 3, learningAreaId: 1 }),
        new BundleFixture({ id: 4, learningAreaId: 2 })
      ]
    });
    const books$: Observable<EduContentInterface[]> = hot('-a-|', {
      a: [
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 1,
            learningAreaId: 1
          })
        },
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 2,
            learningAreaId: 2
          })
        },
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 3,
            learningAreaId: 3
          })
        }
      ]
    });
    expect(
      bundlesViewModel['getLearningAreaIdsWithContent'](bundles$, books$)
    ).toBeObservable(hot('-a-|', { a: [1, 2, 3] }));
  });

  it('getLearningAreasWithContent()', () => {
    const bundles$: Observable<BundleInterface[]> = hot('-a-|', {
      a: [
        new BundleFixture({ id: 1, learningAreaId: 1 }),
        new BundleFixture({ id: 2, learningAreaId: 1 }),
        new BundleFixture({ id: 3, learningAreaId: 1 }),
        new BundleFixture({ id: 4, learningAreaId: 2 })
      ]
    });
    const books$: Observable<EduContentInterface[]> = hot('-a-|', {
      a: [
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 1,
            learningAreaId: 1
          })
        },
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 2,
            learningAreaId: 2
          })
        },
        {
          publishedEduContentMetadata: new EduContentMetadataFixture({
            id: 3,
            learningAreaId: 3
          })
        }
      ]
    });
    const learningArea$ = hot('-a-|', { a: new LearningAreaFixture() });
    const spy = jest
      .spyOn(bundlesViewModel['store'], 'pipe')
      .mockReturnValue(learningArea$);
    expect(
      bundlesViewModel['getLearningAreasWithContent'](bundles$, books$)
    ).toBeObservable(learningArea$);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('getOwnBundles()', () => {
    const ownBundles$ = hot('-a-|', {
      a: [
        new BundleFixture({ id: 1, learningAreaId: 2 }),
        new BundleFixture({ id: 2, learningAreaId: 3 })
      ]
    });
    const spy = jest
      .spyOn(bundlesViewModel['store'], 'pipe')
      .mockReturnValue(ownBundles$);
    expect(bundlesViewModel['getOwnBundles']()).toBeObservable(ownBundles$);
    expect(spy).toHaveBeenCalled();
  });

  it('getSharedLearningAreasCount()', () => {
    return;
  });
});

// const bundlesByLearningArea: Dictionary<BundleInterface[]> = {
//   1: [
//     new BundleFixture({ id: 1, learningAreaId: 1 }),
//     new BundleFixture({ id: 2, learningAreaId: 1 }),
//     new BundleFixture({ id: 3, learningAreaId: 1 })
//   ],
//   2: [
//     new BundleFixture({ id: 4, learningAreaId: 2 }),
//     new BundleFixture({ id: 5, learningAreaId: 2 }),
//     new BundleFixture({ id: 6, learningAreaId: 2 })
//   ],
//   3: [
//     new BundleFixture({ id: 7, learningAreaId: 3 }),
//     new BundleFixture({ id: 8, learningAreaId: 3 }),
//     new BundleFixture({ id: 9, learningAreaId: 3 })
//   ]
// };

// const booksMetaDataByLearningArea: Dictionary<
//   EduContentMetadataInterface[]
// > = {
//   1: [
//     new EduContentMetadataFixture({ id: 1, learningAreaId: 1 }),
//     new EduContentMetadataFixture({ id: 2, learningAreaId: 1 }),
//     new EduContentMetadataFixture({ id: 3, learningAreaId: 1 })
//   ],
//   2: [
//     new EduContentMetadataFixture({ id: 4, learningAreaId: 2 }),
//     new EduContentMetadataFixture({ id: 5, learningAreaId: 2 }),
//     new EduContentMetadataFixture({ id: 6, learningAreaId: 2 })
//   ],
//   3: [
//     new EduContentMetadataFixture({ id: 7, learningAreaId: 3 }),
//     new EduContentMetadataFixture({ id: 8, learningAreaId: 3 }),
//     new EduContentMetadataFixture({ id: 9, learningAreaId: 3 })
//   ]
// };

function entityStore(values, id = 'id') {
  const entities = {};
  const ids = values.forEach(val => {
    entities[val[id]] = val;
    return val[id];
  });
  return {
    ids: ids,
    entities: entities,
    loaded: true
  };
}

function createState(state: Partial<DalState> = {}): DalState {
  const storeState = {
    ui: { loaded: true },
    learningAreas: entityStore([
      new LearningAreaFixture({ id: 1, name: 'foo' }),
      new LearningAreaFixture({ id: 2, name: 'foo' }),
      new LearningAreaFixture({ id: 3, name: 'foo' })
    ]),
    bundles: entityStore([
      new BundleFixture({ id: 1, teacherId: 2, name: 'foo' }),
      new BundleFixture({ id: 2, teacherId: 2, name: 'foo' })
    ]),
    eduContents: entityStore([]),
    userContents: entityStore([]),
    unlockedContents: entityStore([
      new UnlockedContentFixture({ id: 1, bundleId: 1 }),
      new UnlockedContentFixture({ id: 2, bundleId: 1 })
    ]),
    unlockedBoekeGroups: entityStore([]),
    unlockedBoekeStudents: entityStore([
      new UnlockedBoekeStudentFixture({
        studentId: 1,
        teacherId: 2
      })
    ]),
    alerts: entityStore([]),
    contentStatuses: entityStore([]),
    user: {
      currentUser: new PersonFixture(),
      loaded: true
    },
    studentContentStatuses: entityStore([]),
    tasks: entityStore([])
  };

  return Object.assign({}, storeState, state);
}
