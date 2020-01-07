import { ModuleWithProviders } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentFixture,
  EduContentInterface,
  EduContentReducer,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  MethodActions,
  MethodFixture,
  MethodInterface,
  MethodReducer,
  StateFeatureBuilder,
  UiActions,
  UiReducer,
  UnlockedBoekeGroupActions,
  UnlockedBoekeGroupFixture,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentActions,
  UnlockedBoekeStudentFixture,
  UnlockedBoekeStudentInterface,
  UnlockedBoekeStudentReducer
} from '@campus/dal';
import { OPEN_STATIC_CONTENT_SERVICE_TOKEN } from '@campus/shared';
import { ListFormat } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { BooksViewModel } from './books.viewmodel';

describe('BooksViewModel', () => {
  const openContentMock = jest.fn();
  let booksViewModel: BooksViewModel;
  let store: Store<DalState>;
  let uiState: UiReducer.UiState;
  let learningAreaState: LearningAreaReducer.State;
  let unlockedBoekeGroupState: UnlockedBoekeGroupReducer.State;
  let unlockedBoekeStudentState: UnlockedBoekeStudentReducer.State;
  let eduContentState: EduContentReducer.State;
  let methodState: MethodReducer.State;

  let ui: UiReducer.UiState;
  let learningAreas: LearningAreaInterface[];
  let unlockedBoekeGroups: UnlockedBoekeGroupInterface[];
  let unlockedBoekeStudents: UnlockedBoekeStudentInterface[];
  let eduContents: EduContentInterface[];
  let methods: MethodInterface[];

  beforeAll(() => {
    loadState();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        ...getModuleWithForFeatureProviders()
      ],
      providers: [
        BooksViewModel,
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: openContentMock }
        }
      ]
    });

    booksViewModel = TestBed.get(BooksViewModel);
    store = TestBed.get(Store);
  });

  it('should be defined', () => {
    expect(booksViewModel).toBeDefined();
  });

  it('changeListFormat() should update uiStore', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const listFormat = ListFormat.GRID;
    booksViewModel.changeListFormat(listFormat);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      new UiActions.SetListFormat({ listFormat })
    );
  });

  it('openBooks() should call openStaticContentService', () => {
    const mockBook = new EduContentFixture();
    booksViewModel.openBook(mockBook);

    expect(openContentMock).toHaveBeenCalledTimes(1);
    expect(openContentMock).toHaveBeenCalledWith(mockBook);
  });

  describe('sharedBooks$', () => {
    it('should return only shared books', () => {
      const expected = eduContents
        .filter(book => book.id <= 3)
        .map(book => {
          return new EduContentFixture(book, {
            learningArea: learningAreas.find(
              learningArea =>
                learningArea.id ===
                book.publishedEduContentMetadata.learningAreaId
            ),
            methods: [new MethodFixture({ id: 1, icon: 'test' })]
          });
        });
      expect(booksViewModel.sharedBooks$).toBeObservable(
        hot('a', { a: expected })
      );
    });

    it('should also include newly shared book', () => {
      store.dispatch(
        new UnlockedBoekeStudentActions.AddUnlockedBoekeStudent({
          unlockedBoekeStudent: new UnlockedBoekeStudentFixture({
            id: 1,
            teacherId: 2,
            eduContentId: 4
          })
        })
      );

      const expected = eduContents
        .filter(book => book.id <= 4)
        .map(book => {
          return new EduContentFixture(book, {
            learningArea: learningAreas.find(
              learningArea =>
                learningArea.id ===
                book.publishedEduContentMetadata.learningAreaId
            ),
            methods: [new MethodFixture({ id: 1, icon: 'test' })]
          });
        });
      expect(booksViewModel.sharedBooks$).toBeObservable(
        hot('a', { a: expected })
      );
    });
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

    eduContents = [
      new EduContentFixture({ id: 1 }, { learningAreaId: 1, methodIds: [1] }),
      new EduContentFixture({ id: 2 }, { learningAreaId: 1, methodIds: [1] }),
      new EduContentFixture({ id: 3 }, { learningAreaId: 2, methodIds: [1] }),
      new EduContentFixture({ id: 4 }, { learningAreaId: 2, methodIds: [1] }),
      new EduContentFixture({ id: 5 }, { learningAreaId: 2, methodIds: [1] })
    ];
    eduContentState = EduContentReducer.reducer(
      EduContentReducer.initialState,
      new EduContentActions.EduContentsLoaded({
        eduContents: eduContents
      })
    );

    methods = [new MethodFixture({ id: 1, icon: 'test' })];

    methodState = MethodReducer.reducer(
      MethodReducer.initialState,
      new MethodActions.MethodsLoaded({ methods })
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
        NAME: EduContentReducer.NAME,
        reducer: EduContentReducer.reducer,
        initialState: {
          initialState: eduContentState
        }
      },
      {
        NAME: MethodReducer.NAME,
        reducer: MethodReducer.reducer,
        initialState: {
          initialState: methodState
        }
      }
    ]);
  }
});
