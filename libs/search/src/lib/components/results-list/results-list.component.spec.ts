import { CdkScrollable, ScrollingModule } from '@angular/cdk/scrolling';
import { Component, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry, MatTooltipModule } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import {
  SearchFilterFactory,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '../../interfaces';
import { ResultItemBase } from './result.component.base';
import {
  ResultListDirective,
  ResultsListComponent
} from './results-list.component';

@Component({
  selector: 'campus-result-item',
  template: '{{data}}'
})
class ResultItemComponent extends ResultItemBase {
  data: any;
  listRef: null;
}

describe('ResultsListComponentComponent', () => {
  let component: ResultsListComponent;
  let fixture: ComponentFixture<ResultsListComponent>;

  const searchMode: SearchModeInterface = {
    name: 'foo',
    label: 'foo',
    dynamicFilters: false,
    searchFilterFactory: {} as Type<SearchFilterFactory>,
    results: {
      component: ResultItemComponent,
      sortModes: [
        {
          name: 'foo',
          description: 'foo',
          icon: 'foo'
        },
        {
          name: 'bar',
          description: 'bar',
          icon: 'bar'
        }
      ],
      pageSize: 5
    }
  };
  const searchState: SearchStateInterface = {
    searchTerm: '',
    filterCriteriaSelections: new Map()
    // from: 0,
    // sort: null
  };
  const pageResults = [
    { id: 1, title: 'foo' },
    { id: 2, title: 'bar' },
    { id: 3, title: 'baz' }
  ];

  beforeEach(async(() => {
    // TestBed does not allow entryComponents, use overrideModule as workaround
    TestBed.configureTestingModule({
      imports: [UiModule, MatTooltipModule, ScrollingModule],
      declarations: [
        ResultsListComponent,
        ResultItemComponent,
        ResultListDirective
      ],
      providers: [
        ResultItemComponent,
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },

        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemComponent] }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsListComponent);
    component = fixture.componentInstance;

    component.searchMode = searchMode;
    component.searchState = searchState;
    component.resultsPage = { results: pageResults } as SearchResultInterface;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pageResults input', () => {
    it('should display result count', () => {
      const resultCount = 14;
      component.resultsPage = {
        count: resultCount,
        results: []
      } as SearchResultInterface;
      fixture.detectChanges();

      const count = fixture.debugElement.query(
        By.css('.search-results-list__info')
      );
      expect(count.nativeElement.textContent).toContain(resultCount);
    });

    it('should render results', () => {
      const resultItems = fixture.debugElement.queryAll(
        By.directive(ResultItemComponent)
      );

      expect(resultItems.length).toBe(3);
    });

    it('should set result as data input on component', () => {
      const resultItems = fixture.debugElement.queryAll(
        By.directive(ResultItemComponent)
      );

      expect(resultItems.length).toBe(3);
      expect(resultItems[0].componentInstance.data).toBe(pageResults[0]);
      expect(resultItems[1].componentInstance.data).toBe(pageResults[1]);
      expect(resultItems[2].componentInstance.data).toBe(pageResults[2]);
    });

    it('should append results', () => {
      const results = [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' }
      ];
      component.resultsPage = { results } as SearchResultInterface;
      fixture.detectChanges();

      const resultItems = fixture.debugElement.queryAll(
        By.directive(ResultItemComponent)
      );
      expect(resultItems.length).toBe(5);
    });
  });

  describe('searchState.from input', () => {
    it('should clear results', () => {
      component.searchState = { from: null } as SearchStateInterface;
      fixture.detectChanges();

      const resultItems = fixture.debugElement.queryAll(
        By.directive(ResultItemComponent)
      );
      expect(resultItems.length).toBe(0);
    });

    it('should replace results', () => {
      component.searchState = { from: 0 } as SearchStateInterface;
      const results = [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' }
      ];
      component.resultsPage = { results } as SearchResultInterface;
      fixture.detectChanges();

      const resultItems = fixture.debugElement.queryAll(
        By.directive(ResultItemComponent)
      );

      expect(resultItems.length).toBe(2);
    });
  });

  describe('searchState.sort input', () => {
    it('should set searchMode to first sort option', () => {
      const sortButtons = fixture.debugElement.queryAll(
        By.css('campus-button')
      );

      expect(sortButtons.length).toBe(2);
      expect(sortButtons[0].nativeElement.classList).toContain(
        'ui-button--primary'
      );
      expect(sortButtons[1].nativeElement.classList).not.toContain(
        'ui-button--primary'
      );
    });

    it('should init searchMode to specified sort option', () => {
      component.searchState = { sort: 'bar' } as SearchStateInterface;
      fixture.detectChanges();

      const sortButtons = fixture.debugElement.queryAll(
        By.css('campus-button')
      );

      expect(sortButtons.length).toBe(2);
      expect(sortButtons[0].nativeElement.classList).not.toContain(
        'ui-button--primary'
      );
      expect(sortButtons[1].nativeElement.classList).toContain(
        'ui-button--primary'
      );
    });
  });

  describe('sortbutton clicked', () => {
    it('should emit new choice', done => {
      const sortButtons = fixture.debugElement.queryAll(
        By.css('campus-button')
      );

      component.sortBy.subscribe(sort => {
        expect(sort).toBe(searchMode.results.sortModes[1]);
        done();
      });

      sortButtons[1].nativeElement.click();
    });
  });

  describe('on scroll', () => {
    it('should request new results', async(() => {
      const scroller = fixture.debugElement.query(By.directive(CdkScrollable));

      fixture.whenStable().then(() => {
        component['checkForMoreResults'] = jest.fn();
        scroller.nativeElement.dispatchEvent(new Event('scroll'));

        expect(component['checkForMoreResults']).toHaveBeenCalledTimes(1);
      });
    }));
  });
});
