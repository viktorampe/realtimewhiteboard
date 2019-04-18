import { inject, TestBed } from '@angular/core/testing';
import {
  BundleActions,
  BundleFixture,
  BundleInterface,
  BundleReducer,
  DalState,
  EduContentFixture,
  FavoriteReducer,
  getStoreModuleForFeatures,
  TaskActions,
  TaskEduContentReducer,
  TaskFixture,
  TaskInterface,
  TaskReducer,
  UnlockedContentReducer,
  UserContentFixture
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import {
  CollectionManagerService,
  COLLECTION_MANAGER_SERVICE_TOKEN,
  EduContentCollectionManagerService,
  ItemToggledInCollectionInterface
} from './edu-content-collection-manager.service';

describe('EduContentCollectionManagerService', () => {
  let service: EduContentCollectionManagerService;
  let store: Store<DalState>;
  let collectionManagerService: CollectionManagerService;
  let mockToggleEvent: ItemToggledInCollectionInterface;

  const bundles: BundleInterface[] = [
    new BundleFixture({ id: 5, learningAreaId: 1 }),
    new BundleFixture({ id: 6, learningAreaId: 2 }),
    new BundleFixture({ id: 7, learningAreaId: 2 })
  ];
  const tasks: TaskInterface[] = [
    new TaskFixture({ id: 5, learningAreaId: 1 }),
    new TaskFixture({ id: 6, learningAreaId: 2 }),
    new TaskFixture({ id: 7, learningAreaId: 2 })
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          BundleReducer,
          UnlockedContentReducer,
          TaskReducer,
          TaskEduContentReducer,
          FavoriteReducer
        ])
      ],
      providers: [
        Store,
        {
          provide: COLLECTION_MANAGER_SERVICE_TOKEN,
          useValue: {
            manageCollections: jest
              .fn()
              .mockImplementation(() => of(mockToggleEvent))
          }
        }
      ]
    });

    service = TestBed.get(EduContentCollectionManagerService);
    store = TestBed.get(Store);
    collectionManagerService = TestBed.get(COLLECTION_MANAGER_SERVICE_TOKEN);

    // fill store
    store.dispatch(new BundleActions.BundlesLoaded({ bundles }));
    store.dispatch(new TaskActions.TasksLoaded({ tasks }));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be available via DI', inject(
    [EduContentCollectionManagerService],
    (injectedService: EduContentCollectionManagerService) => {
      expect(injectedService).toBeTruthy();
    }
  ));

  describe('manageBundlesForEduContent', () => {
    it('should subscribe to collectionManager changeEvent', () => {
      const eduContent = new EduContentFixture(
        { id: 4 },
        { learningAreaId: 2 }
      );
      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        eduContent,
        eduContent.publishedEduContentMetadata.learningAreaId
      );

      expect(collectionManagerService.manageCollections).toHaveBeenCalledTimes(
        1
      );
      expect(collectionManagerService.manageCollections).toHaveBeenCalledWith(
        eduContent,
        [bundles[1], bundles[2]], // bundles[0] has different learningAreaId
        [],
        []
      );
    });

    it('should call addEduContentToBundle for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'addEduContentToBundle');
      const bundleToLink = bundles[2];
      const eduContent = new EduContentFixture(
        { id: 4 },
        { learningAreaId: 2 }
      );
      mockToggleEvent = {
        item: eduContent,
        relatedItem: bundleToLink,
        selected: true
      };

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        eduContent,
        eduContent.publishedEduContentMetadata.learningAreaId
      );

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(eduContent, bundleToLink);
    });

    it('should call removeEduContentFromBundle for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'removeEduContentFromBundle');
      const bundleToLink = bundles[2];
      const eduContent = new EduContentFixture(
        { id: 4 },
        { learningAreaId: 2 }
      );
      mockToggleEvent = {
        item: eduContent,
        relatedItem: bundleToLink,
        selected: false
      };

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        eduContent,
        eduContent.publishedEduContentMetadata.learningAreaId
      );

      // checks
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(eduContent, bundleToLink);
    });

    it('should call addUserContentToBundle for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'addUserContentToBundle');
      const bundleToLink = bundles[2];
      const userContent = new UserContentFixture({ id: 4 });
      mockToggleEvent = {
        item: userContent,
        relatedItem: bundleToLink,
        selected: true
      };

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(userContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(userContent, bundleToLink);
    });

    it('should call removeUserContentFromBundle for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'removeUserContentFromBundle');
      const bundleToLink = bundles[2];
      const eduContent = new UserContentFixture({ id: 4 });
      mockToggleEvent = {
        item: eduContent,
        relatedItem: bundleToLink,
        selected: false
      };

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(eduContent);

      // checks
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(eduContent, bundleToLink);
    });
  });

  describe('manageTasksForContent', () => {
    it('should subscribe to collectionManager changeEvent', () => {
      const eduContent = new EduContentFixture(
        { id: 4 },
        { learningAreaId: 2 }
      );
      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(eduContent);

      expect(collectionManagerService.manageCollections).toHaveBeenCalledTimes(
        1
      );
      expect(collectionManagerService.manageCollections).toHaveBeenCalledWith(
        eduContent,
        [tasks[1], tasks[2]], // tasks[0] has different learningAreaId
        [],
        []
      );
    });

    it('should call addContentToTask for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'addContentToTask');
      const taskToLink = tasks[2];
      const eduContent = new EduContentFixture(
        { id: 4 },
        { learningAreaId: 2 }
      );
      mockToggleEvent = {
        item: eduContent,
        relatedItem: taskToLink,
        selected: true
      };

      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(eduContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(eduContent, taskToLink);
    });

    it('should call removeContentFromTask for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'removeContentFromTask');
      const taskToLink = tasks[2];
      const eduContent = new EduContentFixture(
        { id: 4 },
        { learningAreaId: 2 }
      );
      mockToggleEvent = {
        item: eduContent,
        relatedItem: taskToLink,
        selected: false
      };

      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(eduContent);

      // checks
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(eduContent, taskToLink);
    });
  });
});

// file.only
