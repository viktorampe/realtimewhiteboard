import { inject, TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentActions,
  EduContentFixture,
  EduContentInterface,
  FavoriteActions,
  FavoriteFixture,
  FavoriteReducer,
  getStoreModuleForFeatures
} from '@campus/dal';
import {
  EduContentCollectionManagerServiceInterface,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { EduContentSearchResultItemService } from './edu-content-search-result.service';
import { EduContentSearchResultItemServiceInterface } from './edu-content-search-result.service.interface';

describe('EduContentSearchResultItemService', () => {
  let openStaticContentService: OpenStaticContentServiceInterface;
  let scormExerciseService: ScormExerciseServiceInterface;
  let eduContentManagerService: EduContentCollectionManagerServiceInterface;
  let eduContentSearchResultItemService: EduContentSearchResultItemServiceInterface;
  let store: Store<DalState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([FavoriteReducer])
      ],
      providers: [
        EduContentSearchResultItemService,
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        },
        {
          provide: EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
          useValue: {
            manageTasksForContent: jest.fn(),
            manageBundlesForContent: jest.fn()
          }
        },
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useValue: { previewExerciseFromUnlockedContent: jest.fn() }
        },
        Store
      ]
    });

    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
    eduContentManagerService = TestBed.get(
      EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN
    );
    eduContentSearchResultItemService = TestBed.get(
      EduContentSearchResultItemService
    );

    store = TestBed.get(Store);
  });

  it('should be created', inject(
    [EduContentSearchResultItemService],
    (service: EduContentSearchResultItemService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('isFavorite$', () => {
    it('should return data from the store', () => {
      const eduContentId = 42;
      const favorite = new FavoriteFixture({
        eduContentId
      });
      store.dispatch(
        new FavoriteActions.FavoritesLoaded({ favorites: [favorite] })
      );

      expect(
        eduContentSearchResultItemService.isFavorite$(eduContentId)
      ).toBeObservable(hot('a', { a: true }));
      expect(
        eduContentSearchResultItemService.isFavorite$(eduContentId + 1)
      ).toBeObservable(hot('a', { a: false }));
    });
  });

  describe('toggleFavorite', () => {
    it('should dispatch a ToggleFavorite action', () => {
      store.dispatch = jest.fn();
      const favorite = new FavoriteFixture();

      eduContentSearchResultItemService.toggleFavorite(favorite);

      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new FavoriteActions.ToggleFavorite({ favorite })
      );
    });
  });

  describe('linkTask', () => {
    it('should call manageTasksForContent on the eduContentManagerService', () => {
      const eduContent = new EduContentFixture();

      eduContentSearchResultItemService.linkTask(eduContent);

      expect(eduContentManagerService.manageTasksForContent).toHaveBeenCalled();
      expect(
        eduContentManagerService.manageTasksForContent
      ).toHaveBeenCalledWith(eduContent);
    });
  });

  describe('linkBundle', () => {
    it('should call manageBundlesForContent on the eduContentManagerService', () => {
      const eduContent = new EduContentFixture();

      eduContentSearchResultItemService.linkBundle(eduContent);

      expect(
        eduContentManagerService.manageBundlesForContent
      ).toHaveBeenCalled();
      expect(
        eduContentManagerService.manageBundlesForContent
      ).toHaveBeenCalledWith(
        eduContent,
        eduContent.publishedEduContentMetadata.learningAreaId
      );
    });
  });

  describe('openStatic', () => {
    it('should call open on the openStaticContentService', () => {
      const eduContent = new EduContentFixture();

      eduContentSearchResultItemService.openStatic(eduContent, true);

      expect(openStaticContentService.open).toHaveBeenCalled();
      expect(openStaticContentService.open).toHaveBeenCalledWith(
        eduContent,
        true
      );
    });
  });

  describe('openExercise', () => {
    it('should call previewExerciseFromUnlockedContent on the scormExerciseService', () => {
      const eduContentId = 1;

      eduContentSearchResultItemService.openExercise(eduContentId, true);

      expect(
        scormExerciseService.previewExerciseFromUnlockedContent
      ).toHaveBeenCalled();
      expect(
        scormExerciseService.previewExerciseFromUnlockedContent
      ).toHaveBeenCalledWith(null, eduContentId, null, true);
    });
  });

  describe('upsertEduContentToStore', () => {
    it('should dispatch a UpsertEduContent action', () => {
      store.dispatch = jest.fn();
      const eduContent: EduContentInterface = new EduContentFixture();

      eduContentSearchResultItemService.upsertEduContentToStore(eduContent);

      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new EduContentActions.UpsertEduContent({ eduContent })
      );
    });
  });
});
