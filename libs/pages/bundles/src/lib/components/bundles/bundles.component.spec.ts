import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BundleInterface,
  EduContentBookInterface,
  EduContentInterface,
  LearningAreaInterface
} from '@campus/dal';
import { BehaviorSubject, Observable } from 'rxjs';
import { BundlesViewModel } from '../bundles.viewmodel';
import { BundlesComponent } from './bundles.component';

let bundlesViewModel: MockViewModel;

class MockViewModel extends BundlesViewModel {
  books$: Observable<EduContentBookInterface[]> = new BehaviorSubject<
    EduContentBookInterface[]
  >([
    {
      title: 'boek1',
      method: {
        name: 'none',
        logoUrl: 'roadToNowhere'
      }
    },
    {
      title: 'boek2',
      method: {
        name: 'none',
        logoUrl: 'roadToNowhere'
      }
    },
    {
      title: 'boek3',
      method: {
        name: 'none',
        logoUrl: 'roadToNowhere'
      }
    },
    {
      title: 'boek4',
      method: {
        name: 'none',
        logoUrl: 'roadToNowhere'
      }
    },
    {
      title: 'boek5',
      method: {
        name: 'none',
        logoUrl: 'roadToNowhere'
      }
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

  getBundleItemCount(bundle: BundleInterface): number {
    return 0;
  }

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
      eduContents: [
        this.createEduContent(),
        this.createEduContent(),
        this.createEduContent(),
        this.createEduContent(),
        this.createEduContent()
      ]
    };
  }

  private createEduContent(): EduContentInterface {
    return {
      type: '?'
    };
  }
}

beforeEach(() => {
  bundlesViewModel = new MockViewModel();
});

test('it should return', () => {
  return;
});

describe('BundlesComponent', () => {
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
    component.filterInput$.next('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should return 5 bundles', () => {
    bundlesViewModel
      .getDisplayedBundles(bundlesViewModel.bundles$, component.filterInput$)
      .subscribe((bundles: BundleInterface[]) => {
        console.log(bundles[0].eduContents[0].publishedEduContentMetadata);
        expect(bundles.length).toBe(5);
      });
  });

  it('it should return 5 books', () => {
    component.books$.subscribe((books: EduContentBookInterface[]) => {
      expect(books.length).toEqual(5);
    });
  });

  it('should filter out all but 1 bundle, case insensitve', () => {
    component.filterInput$.next('BunDlE oF Joy');
    bundlesViewModel
      .getDisplayedBundles(bundlesViewModel.bundles$, component.filterInput$)
      .subscribe((bundles: BundleInterface[]) => {
        expect(bundles.length).toEqual(1);
      });
  });

  it('should return a no bundles', () => {
    component.filterInput$.next('lol');
    bundlesViewModel
      .getDisplayedBundles(bundlesViewModel.bundles$, component.filterInput$)
      .subscribe((bundles: BundleInterface[]) => {
        expect(bundles.length).toEqual(0);
      });
  });
});
