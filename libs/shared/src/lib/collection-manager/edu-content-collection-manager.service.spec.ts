import { inject, TestBed } from '@angular/core/testing';
import {
  BundleActions,
  BundleFixture,
  BundleInterface,
  BundleReducer,
  ContentInterface,
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
import {
  CollectionManagerServiceInterface,
  COLLECTION_MANAGER_SERVICE_TOKEN,
  ItemToggledInCollectionInterface,
  ManageCollectionItemInterface
} from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { EduContentCollectionManagerService } from './edu-content-collection-manager.service';
import {
  EduContentCollectionManagerServiceInterface,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN
} from './edu-content-collection-manager.service.interface';

describe('EduContentCollectionManagerService', () => {
  let service: EduContentCollectionManagerServiceInterface;
  let store: Store<DalState>;
  let collectionManagerService: CollectionManagerServiceInterface;
  let mockToggleEvent: ItemToggledInCollectionInterface;

  const bundles: BundleInterface[] = [
    new BundleFixture({ id: 5, learningAreaId: 1 }),
    new BundleFixture({ id: 6, learningAreaId: 2 }),
    new BundleFixture({ id: 7, learningAreaId: 2 })
  ];
  const bundlesCollection: ManageCollectionItemInterface[] = [
    { id: 6, label: 'foo', icon: 'bundle' },
    { id: 7, label: 'foo', icon: 'bundle' }
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
  const tasksCollection: ManageCollectionItemInterface[] = [
    { id: 6, label: 'foo', icon: 'task' },
    { id: 7, label: 'foo', icon: 'task' }
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
          provide: EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
          useClass: EduContentCollectionManagerService
        },
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

    service = TestBed.get(EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN);
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
    let actionSpy: jest.SpyInstance;
    beforeEach(() => {
      actionSpy = jest.spyOn(store, 'dispatch');
    });

    it('should subscribe to collectionManager changeEvent', () => {
      // create spies and mocks
      const spy = jest
        .spyOn(collectionManagerService, 'manageCollections')
        .mockImplementation(() => of());

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        selectedEduContent,
        selectedEduContent.publishedEduContentMetadata.learningAreaId
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        '"foo" toevoegen aan je bundels',
        { id: 4, label: 'foo', icon: 'bundle' },
        bundlesCollection, // bundles[0] has different learningAreaId
        [7],
        []
      );
    });

    it('should link eduContent to bundle for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      mockToggleEvent = getMockToggleEvent({
        item: selectedEduContent,
        relatedItem: selectedBundle,
        selected: true
      });

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        selectedEduContent,
        selectedEduContent.publishedEduContentMetadata.learningAreaId
      );

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new BundleActions.LinkEduContent({
          bundleId: selectedBundle.id,
          eduContentId: selectedEduContent.id
        })
      );
    });

    it('should remove eduContent from bundle for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      mockToggleEvent = getMockToggleEvent({
        item: selectedEduContent,
        relatedItem: selectedBundle,
        selected: false
      });

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(
        selectedEduContent,
        selectedEduContent.publishedEduContentMetadata.learningAreaId
      );

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new UnlockedContentActions.DeleteUnlockedContent({
          id: 11
        })
      );
    });

    it('should link userContent to bundle for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      mockToggleEvent = getMockToggleEvent({
        item: selectedUserContent,
        relatedItem: selectedBundle,
        selected: true
      });

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(selectedUserContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new BundleActions.LinkUserContent({
          bundleId: selectedBundle.id,
          userContentId: selectedUserContent.id
        })
      );
    });

    it('should remove userContent from bundle for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      mockToggleEvent = getMockToggleEvent({
        item: selectedUserContent,
        relatedItem: selectedBundle,
        selected: false
      });

      // subscribe to collectionManager changeEvent
      service.manageBundlesForContent(selectedUserContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new UnlockedContentActions.DeleteUnlockedContent({
          id: 12
        })
      );
    });
  });

  describe('manageTasksForContent', () => {
    let actionSpy: jest.SpyInstance;
    beforeEach(() => {
      actionSpy = jest.spyOn(store, 'dispatch');
    });

    it('should subscribe to collectionManager changeEvent', () => {
      // create spies and mocks
      const spy = jest
        .spyOn(collectionManagerService, 'manageCollections')
        .mockImplementation(() => of());

      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(selectedEduContent);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        '"foo" toevoegen aan je taken',
        { id: 4, label: 'foo', icon: 'task' },
        tasksCollection,
        [7],
        []
      );
    });

    it('should link eduContent to task for itemToggledEvent with selected = true', () => {
      // create spies and mocks
      mockToggleEvent = getMockToggleEvent({
        item: selectedEduContent,
        relatedItem: selectedTask,
        selected: true
      });

      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(selectedEduContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new TaskEduContentActions.LinkTaskEduContent({
          taskId: selectedTask.id,
          eduContentId: selectedEduContent.id
        })
      );
    });

    it('should remove eduContent from task for itemToggledEvent with selected = false', () => {
      // create spies and mocks
      mockToggleEvent = getMockToggleEvent({
        item: selectedEduContent,
        relatedItem: selectedTask,
        selected: false
      });

      // subscribe to collectionManager changeEvent
      service.manageTasksForContent(selectedEduContent);

      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith(
        new TaskEduContentActions.DeleteTaskEduContent({
          id: 13
        })
      );
    });
  });

  function getMockToggleEvent({
    item,
    relatedItem,
    selected
  }: {
    item: ContentInterface;
    relatedItem: TaskInterface | BundleInterface;
    selected: boolean;
  }) {
    return {
      item: { id: item.id, label: item.name },
      relatedItem: { id: relatedItem.id, label: relatedItem.name },
      selected
    };
  }
});
