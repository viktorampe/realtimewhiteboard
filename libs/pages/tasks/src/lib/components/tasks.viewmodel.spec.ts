import { TestBed } from '@angular/core/testing';
import { AUTH_SERVICE_TOKEN } from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { TasksViewModel } from './tasks.viewmodel';

describe('TasksViewModel', () => {
  let storeState;

  let tasksViewModel: TasksViewModel;


  const booksMetaDataByLearningArea: Dictionary<
    EduContentMetadataInterface[]
  > = {
    1: [
      new EduContentMetadataFixture({ id: 1, learningAreaId: 1 }),
      new EduContentMetadataFixture({ id: 2, learningAreaId: 1 }),
      new EduContentMetadataFixture({ id: 3, learningAreaId: 1 })
    ],
    2: [
      new EduContentMetadataFixture({ id: 4, learningAreaId: 2 }),
      new EduContentMetadataFixture({ id: 5, learningAreaId: 2 }),
      new EduContentMetadataFixture({ id: 6, learningAreaId: 2 })
    ],
    3: [
      new EduContentMetadataFixture({ id: 7, learningAreaId: 3 }),
      new EduContentMetadataFixture({ id: 8, learningAreaId: 3 }),
      new EduContentMetadataFixture({ id: 9, learningAreaId: 3 })
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        TasksViewModel,
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: {} }
      ]
    });
    tasksViewModel = TestBed.get(TasksViewModel);

    storeState = {
      bundles: {
        bundles: [],
        loaded: true
      }
    };
  });

test('it should return', () => {
  return;
});
