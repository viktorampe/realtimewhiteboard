// file.only
import { ModuleWithProviders } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  EduContentActions,
  EduContentFixture,
  EduContentInterface,
  EduContentReducer,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  StateFeatureBuilder,
  UiActions,
  UiReducer,
  UnlockedBoekeGroupActions,
  UnlockedBoekeGroupFixture,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentActions,
  UnlockedBoekeStudentInterface,
  UnlockedBoekeStudentReducer
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { BooksViewModel } from './books.viewmodel';

describe('BooksViewModel', () => {
  let booksViewModel: BooksViewModel;
  let uiState: UiReducer.UiState;
  let learningAreaState: LearningAreaReducer.State;
  let unlockedBoekeGroupState: UnlockedBoekeGroupReducer.State;
  let unlockedBoekeStudentState: UnlockedBoekeStudentReducer.State;
  let eduContentState: EduContentReducer.State;

  let ui: UiReducer.UiState;
  let learningAreas: LearningAreaInterface[];
  let unlockedBoekeGroups: UnlockedBoekeGroupInterface[];
  let unlockedBoekeStudents: UnlockedBoekeStudentInterface[];
  let eduContents: EduContentInterface[];

  beforeAll(() => {
    loadState();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), ...getModuleWithForFeatureProviders()],
      providers: [
        BooksViewModel,
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } }
      ]
    });

    booksViewModel = TestBed.get(BooksViewModel);
  });

  it('should be defined', () => {
    expect(booksViewModel).toBeDefined();
  });

  it('changeListFormat() should update uiStore', () => {
    const spy = jest.spyOn(UiActions, 'SetListFormat');
    const listFormat = ListFormat.GRID;
    booksViewModel.changeListFormat(listFormat);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ listFormat });
  });

  it('sharedBooks$', () => {
    const expected = eduContents.map(book => {
      return new EduContentFixture(book, {
        learningArea: learningAreas.find(
          learningArea =>
            learningArea.id === book.publishedEduContentMetadata.learningAreaId
        )
      });
    });
    expect(booksViewModel.sharedBooks$).toBeObservable(
      hot('a', { a: expected })
    );
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
      }
    ]);
  }
});
