import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LearningAreaFixture } from '@campus/dal';
import { SearchFilterCriteriaInterface } from '../../interfaces/search-filter-criteria.interface';
import { BreadcrumbFilterComponent } from './breadcrumb-filter.component';

const mockFilterCriteria: SearchFilterCriteriaInterface[] = [
  {
    name: 'breadCrumbFilter',
    label: 'FooLabel',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'foo jaar'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: 'bar jaar'
        },
        selected: false
      },
      {
        data: {
          id: 3,
          name: 'baz jaar'
        },
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'foo jaar',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: new LearningAreaFixture({
          id: 1,
          name: 'foo'
        }),
        selected: false
      },
      {
        data: new LearningAreaFixture({
          id: 2,
          name: 'bar'
        }),
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'foo learning area',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'foo'
        },
        selected: false
      },
      {
        data: {
          id: 2,
          name: 'bar'
        },
        selected: false
      }
    ]
  }
];

// file.only
describe('BreadcrumbFilterComponent', () => {
  let component: BreadcrumbFilterComponent;
  let fixture: ComponentFixture<BreadcrumbFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbFilterComponent]
    }).compileComponents();
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

  it('should change the filter selection on clicking a breadcrumb', () => {
    const clickBreadcrumbSpy = jest.spyOn(component, 'clickBreadcrumb');
    const secondBreadcrumb: HTMLAnchorElement = fixture.debugElement.queryAll(
      By.css('a')
    )[1].nativeElement;

    let emittedValue: SearchFilterCriteriaInterface[];

    component.filterSelectionChange.subscribe(newFilterCriteria => {
      emittedValue = newFilterCriteria;
    });

    secondBreadcrumb.click();

    expect(clickBreadcrumbSpy).toHaveBeenCalledTimes(1);
    expect(clickBreadcrumbSpy).toHaveBeenCalledWith(1);

    const expectedValue = [
      {
        name: 'breadCrumbFilter',
        label: 'FooLabel',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: {
              id: 1,
              name: 'foo jaar'
            },
            selected: true
          },
          {
            data: {
              id: 2,
              name: 'bar jaar'
            },
            selected: false
          },
          {
            data: {
              id: 3,
              name: 'baz jaar'
            },
            selected: false
          }
        ]
      },
      {
        name: 'breadCrumbFilter',
        label: 'foo jaar',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: new LearningAreaFixture({
              id: 1,
              name: 'foo'
            }),
            selected: false
          },
          {
            data: new LearningAreaFixture({
              id: 2,
              name: 'bar'
            }),
            selected: false
          }
        ]
      }
    ];

    expect(emittedValue).toEqual(expectedValue);
  });
});
