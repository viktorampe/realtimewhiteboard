import { TestBed } from '@angular/core/testing';
import {
  DalState,
  getStoreModuleForFeatures,
  TocServiceInterface,
  TOC_SERVICE_TOKEN
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { ChapterLessonFilterFactory } from './chapter-lesson-filter.factory';

describe('TocFilterFactory', () => {
  let store: Store<DalState>;
  let tocService: TocServiceInterface;
  let factory: ChapterLessonFilterFactory;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), ...getStoreModuleForFeatures([])],
      providers: [
        ChapterLessonFilterFactory,
        Store,
        {
          provide: TOC_SERVICE_TOKEN,
          useValue: {}
        }
      ]
    });

    store = TestBed.get(Store);

    tocService = TestBed.get(TOC_SERVICE_TOKEN);
  });

  beforeEach(() => {
    factory = TestBed.get(ChapterLessonFilterFactory);
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });
});
