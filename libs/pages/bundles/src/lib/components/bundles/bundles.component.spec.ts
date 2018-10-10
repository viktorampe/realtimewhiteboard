import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BundleInterface,
  EduContentBookInterface,
  LearningAreaInterface
} from '@campus/dal';
import { BehaviorSubject, Observable } from 'rxjs';
import { BundlesComponent } from './bundles.component';

let bundlesViewModel: MockViewModel;

class MockViewModel {
  constructor() {}

  filterInput$ = new BehaviorSubject<string>('');

  books$: Observable<EduContentBookInterface[]> = new BehaviorSubject<
    EduContentBookInterface[]
  >([
    {
      title: 'boek1'
    },
    {
      title: 'boek2'
    },
    {
      title: 'boek3'
    },
    {
      title: 'boek4'
    },
    {
      title: 'boek5'
    }
  ]);

  selectedLearningArea$: Observable<
    LearningAreaInterface
  > = new BehaviorSubject<LearningAreaInterface>({
    icon: 'polpo-wiskunde',
    id: 19,
    color: '#2c354f',
    name: 'Wiskunde'
  });

  bundles$: Observable<BundleInterface[]> = new BehaviorSubject<
    BundleInterface[]
  >([
    this.createBundle('bundle', 19),
    this.createBundle('bundle 2: the bundleing', 19),
    this.createBundle('bundle 3: a bundle of sticks', 19),
    this.createBundle('bundle 4: bundle of joy', 19),
    this.createBundle('bundle 5: bundle of rights', 19)
  ]);

  learningAreas$: Observable<LearningAreaInterface[]> = new BehaviorSubject<
    LearningAreaInterface[]
  >([
    {
      icon: 'polpo-wiskunde',
      id: 19,
      color: '#2c354f',
      name: 'Wiskunde'
    },
    {
      icon: 'polpo-aardrijkskunde',
      id: 1,
      color: '#485235',
      name: 'Aardrijkskunde'
    },
    {
      icon: 'polpo-frans',
      id: 2,
      color: '#385343',
      name: 'Frans'
    },
    {
      icon: 'polpo-godsdienst',
      id: 13,
      color: '#325235',
      name: 'Godsdienst, Didactische & Pedagogische ondersteuning'
    }
  ]);
  learningAreasCounts$: Observable<any> = new BehaviorSubject<any>({
    1: {
      booksCount: 1,
      bundlesCount: 2
    },
    2: {
      booksCount: 4,
      bundlesCount: 0
    },
    13: {
      booksCount: 0,
      bundlesCount: 0
    },
    19: {
      booksCount: 9,
      bundlesCount: 7
    }
  });

  //todo remove when we have actual data
  createBundle(name: string, learningAreaId: number): BundleInterface {
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    endDate.setHours(endDate.getHours() + 2);

    return {
      id: Math.round(Math.random() * 10000),
      teacherId: Math.round(Math.random() * 10000),
      learningAreaId: learningAreaId,
      name: name,
      description: 'this description includes' + name,
      start: startDate,
      end: endDate,
      tasks: [
        {
          name: 'task1'
        },
        {
          name: 'task2'
        },
        {
          name: 'task3'
        },
        {
          name: 'task4'
        },
        {
          name: 'task5'
        },
        {
          name: 'task6'
        },
        {
          name: 'task7'
        }
      ]
    };
  }
}

beforeEach(() => {
  bundlesViewModel = new MockViewModel();
});

test('it should return', () => {
  return;
});

describe('LearningAreasComponent', () => {
  let component: BundlesComponent;
  let fixture: ComponentFixture<BundlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BundlesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesComponent);
    component = fixture.componentInstance;
    bundlesViewModel.filterInput$.next('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should return 5 bundles', () => {
    component
      .getDisplayedBundles(
        bundlesViewModel.bundles$,
        bundlesViewModel.filterInput$
      )
      .subscribe((bundles: BundleInterface[]) => {
        expect(bundles.length).toBe(5);
      });
  });

  it('it should return 5 books', () => {
    component
      .getDisplayedBooks(bundlesViewModel.books$)
      .subscribe((books: EduContentBookInterface[]) => {
        expect(books.length).toEqual(5);
      });
  });

  it('should return a single bundle', () => {
    bundlesViewModel.filterInput$.next('lol');

    component
      .getDisplayedBundles(
        bundlesViewModel.bundles$,
        bundlesViewModel.filterInput$
      )
      .subscribe((bundles: BundleInterface[]) => {
        expect(bundles.length).toEqual(0);
      });
  });

  it('bundles should be independant of filter', () => {
    //this test might be a bit much because filter is never passed to the method but i chose to include it anway.
    bundlesViewModel.filterInput$.next('lol');

    component
      .getDisplayedBooks(bundlesViewModel.books$)
      .subscribe((books: EduContentBookInterface[]) => {
        expect(books.length).toEqual(5);
      });
  });
});
