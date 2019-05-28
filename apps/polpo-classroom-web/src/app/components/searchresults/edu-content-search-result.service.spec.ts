import { inject, TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentActions,
  EduContentFixture,
  EduContentInterface,
  FavoriteActions,
  FavoriteFixture,
  FavoriteReducer,
  getStoreModuleForFeatures,
  HistoryActions,
  HistoryFixture
} from '@campus/dal';
import {
  EduContentCollectionManagerServiceInterface,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  PermissionService,
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN,
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
  let permissionService: PermissionServiceInterface;
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
        {
          provide: PERMISSION_SERVICE_TOKEN,
          useClass: PermissionService
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
    permissionService = TestBed.get(PERMISSION_SERVICE_TOKEN);

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

  describe('upsertHistoryToStore', () => {
    const mockHistory = new HistoryFixture();

    it('should dispatch a StartUpsertHistory action if the user has the permission', () => {
      // TODO: fix test, for some reason these tests won't work ...
      const spy = jest.spyOn(TestBed.get(Store), 'dispatch');
      jest
        .spyOn(permissionService, 'hasPermission')
        .mockReturnValue(hot('a', { a: true }));

      eduContentSearchResultItemService.upsertHistoryToStore(mockHistory);

      expect(spy).toHaveBeenCalledWith(
        new HistoryActions.StartUpsertHistory({ history: mockHistory })
      );
    });
    it('should not dispatch a StartUpsertHistory action if the user does not have the permission', () => {
      //  TODO: this test is a false positive! Needs to get fixed
      const spy = jest.spyOn(store, 'dispatch');

      jest
        .spyOn(permissionService, 'hasPermission')
        .mockReturnValue(hot('a', { a: false }));

      eduContentSearchResultItemService.upsertHistoryToStore(mockHistory);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
