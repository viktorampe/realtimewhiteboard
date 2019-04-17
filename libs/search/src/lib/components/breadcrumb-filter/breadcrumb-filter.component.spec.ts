import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '../../+fixtures/search-filter-criteria.fixture';
import { SearchFilterCriteriaInterface } from '../../interfaces/search-filter-criteria.interface';
import { BreadcrumbFilterComponent } from './breadcrumb-filter.component';

const mockFilterCriteria: SearchFilterCriteriaInterface[] = [
  new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture({ selected: true })
  ]),
  new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture({ selected: true })
  ]),
  new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture({ selected: true })
  ]),
  new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture({ selected: true })
  ])
];

describe('BreadcrumbFilterComponent', () => {
  let component: BreadcrumbFilterComponent;
  let fixture: ComponentFixture<BreadcrumbFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbFilterComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbFilterComponent);
    component = fixture.componentInstance;
    component.filterCriteria = mockFilterCriteria;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the filter selection on clicking a breadcrumb', done => {
    const clickBreadcrumbSpy = jest.spyOn(component, 'clickBreadcrumb');

    const secondBreadcrumb: HTMLAnchorElement = fixture.debugElement.queryAll(
      By.css('a')
    )[2].nativeElement; // index 2 because there is an anchor tag outside of the for loop

    const expectedValue = [
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({ selected: true })
      ]),
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({ selected: true })
      ]),
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({ selected: false })
      ]),
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({ selected: false })
      ])
    ];
    component.filterSelectionChange.subscribe(emittedValue => {
      expect(clickBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(clickBreadcrumbSpy).toHaveBeenCalledWith(1);
      expect(emittedValue).toEqual(expectedValue);
      done();
    });

    secondBreadcrumb.click();
  });

  it('should reset the filter criteria when clicking the root breadcrumb', done => {
    const resetSpy = jest.spyOn(component, 'reset');

    const rootBreadcrumb: HTMLAnchorElement = fixture.debugElement.queryAll(
      By.css('a')
    )[0].nativeElement;

    const expectedValue = [
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({ selected: false })
      ]),
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({ selected: false })
      ]),
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({ selected: false })
      ]),
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({ selected: false })
      ])
    ];

    component.filterSelectionChange.subscribe(emittedValue => {
      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(emittedValue).toEqual(expectedValue);
      done();
    });

    rootBreadcrumb.click();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
