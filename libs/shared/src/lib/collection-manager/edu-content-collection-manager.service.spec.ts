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
  TaskEduContentActions,
  TaskEduContentFixture,
  TaskEduContentInterface,
  TaskEduContentReducer,
  TaskFixture,
  TaskInterface,
  TaskReducer,
  UnlockedContentActions,
  UnlockedContentFixture,
  UnlockedContentInterface,
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
  const selectedBundle = bundles[2];
  const selectedEduContent = new EduContentFixture(
    { id: 4 },
    { learningAreaId: 2 }
  );
  const selectedUserContent = new UserContentFixture({ id: 4 });
  const unlockedContents: UnlockedContentInterface[] = [
    new UnlockedContentFixture({
      id: 11,
      eduContentId: selectedEduContent.id,
      bundleId: selectedBundle.id
    }),
    new UnlockedContentFixture({
      id: 12,
      userContentId: selectedUserContent.id,
      bundleId: selectedBundle.id
    })
  ];
  const tasks: TaskInterface[] = [
    new TaskFixture({ id: 5, learningAreaId: 1 }),
    new TaskFixture({ id: 6, learningAreaId: 2 }),
    new TaskFixture({ id: 7, learningAreaId: 2 })
  ];
  const selectedTask = tasks[2];
  const taskEduContents: TaskEduContentInterface[] = [
    new TaskEduContentFixture({
      id: 13,
      eduContentId: selectedEduContent.id,
      taskId: selectedTask.id
    })
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
    store.dispatch(
      new UnlockedContentActions.UnlockedContentsLoaded({ unlockedContents })
    );
    store.dispatch(new TaskActions.TasksLoaded({ tasks }));
    store.dispatch(
      new TaskEduContentActions.TaskEduContentsLoaded({ taskEduContents })
    );
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
      // create spies and mocks
      jest
        .spyOn(collectionManagerService, 'manageCollections')
        .mockImplementation(() => of());

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        selectedEduContent,
        selectedEduContent.publishedEduContentMetadata.learningAreaId
      );

      expect(collectionManagerService.manageCollections).toHaveBeenCalledTimes(
        1
      );
      expect(collectionManagerService.manageCollections).toHaveBeenCalledWith(
        selectedEduContent,
        [bundles[1], bundles[2]], // bundles[0] has different learningAreaId
        [7],
        []
      );
    });

    it('should call addEduContentToBundle for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'addEduContentToBundle');
      mockToggleEvent = {
        item: selectedEduContent,
        relatedItem: selectedBundle,
        selected: true
      };

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        selectedEduContent,
        selectedEduContent.publishedEduContentMetadata.learningAreaId
      );

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        selectedEduContent,
        selectedBundle
      );
    });

    it('should call removeEduContentFromBundle for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      const actionSpy = jest
        .spyOn(service, 'removeEduContentFromBundle')
        .mockImplementation(() => of());
      mockToggleEvent = {
        item: selectedEduContent,
        relatedItem: selectedBundle,
        selected: false
      };

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        selectedEduContent,
        selectedEduContent.publishedEduContentMetadata.learningAreaId
      );

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        selectedEduContent,
        selectedBundle
      );
    });

    it('should call addUserContentToBundle for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'addUserContentToBundle');
      mockToggleEvent = {
        item: selectedUserContent,
        relatedItem: selectedBundle,
        selected: true
      };

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(selectedUserContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        selectedUserContent,
        selectedBundle
      );
    });

    it('should call removeUserContentFromBundle for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      const actionSpy = jest
        .spyOn(service, 'removeUserContentFromBundle')
        .mockImplementation(() => of());
      mockToggleEvent = {
        item: selectedUserContent,
        relatedItem: selectedBundle,
        selected: false
      };

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(selectedUserContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        selectedUserContent,
        selectedBundle
      );
    });
  });

  describe('manageTasksForContent', () => {
    it('should subscribe to collectionManager changeEvent', () => {
      // create spies and mocks
      jest
        .spyOn(collectionManagerService, 'manageCollections')
        .mockImplementation(() => of());

      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(selectedEduContent);

      expect(collectionManagerService.manageCollections).toHaveBeenCalledTimes(
        1
      );
      expect(collectionManagerService.manageCollections).toHaveBeenCalledWith(
        selectedEduContent,
        [tasks[1], tasks[2]], // tasks[0] has different learningAreaId
        [7],
        []
      );
    });

    it('should call addContentToTask for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      const actionSpy = jest.spyOn(service, 'addContentToTask');
      mockToggleEvent = {
        item: selectedEduContent,
        relatedItem: selectedTask,
        selected: true
      };

      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(selectedEduContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(selectedEduContent, selectedTask);
    });

    it('should call removeContentFromTask for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      const actionSpy = jest
        .spyOn(service, 'removeContentFromTask')
        .mockImplementation(() => of());
      mockToggleEvent = {
        item: selectedEduContent,
        relatedItem: selectedTask,
        selected: false
      };

      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(selectedEduContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(selectedEduContent, selectedTask);
    });
  });

  describe('store dispatch actions', () => {
    let actionSpy: jest.SpyInstance;
    beforeEach(() => {
      actionSpy = jest.spyOn(store, 'dispatch');
    });

    it('addContentToTask', () => {
      service.addContentToTask(selectedEduContent, selectedTask);
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new TaskEduContentActions.LinkTaskEduContent({
          taskId: selectedTask.id,
          eduContentId: selectedEduContent.id,
          displayResponse: true
        })
      );
    });

    it('addEduContentToBundle', () => {
      service.addEduContentToBundle(selectedEduContent, selectedBundle);
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new BundleActions.LinkEduContent({
          bundleId: selectedBundle.id,
          eduContentId: selectedEduContent.id
        })
      );
    });

    it('addUserContentToBundle', () => {
      service.addUserContentToBundle(selectedUserContent, selectedBundle);
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new BundleActions.LinkUserContent({
          bundleId: selectedBundle.id,
          userContentId: selectedUserContent.id
        })
      );
    });

    it('removeContentFromTask', () => {
      service.removeContentFromTask(selectedEduContent, selectedTask);
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new TaskEduContentActions.DeleteTaskEduContent({
          id: 13
        })
      );
    });

    it('removeEduContentFromBundle', () => {
      service.removeEduContentFromBundle(selectedEduContent, selectedBundle);
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new UnlockedContentActions.DeleteUnlockedContent({
          id: 11
        })
      );
    });

    it('removeUserContentFromBundle', () => {
      service.removeUserContentFromBundle(selectedUserContent, selectedBundle);
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new UnlockedContentActions.DeleteUnlockedContent({
          id: 12
        })
      );
    });
  });
});
