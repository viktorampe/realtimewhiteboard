import { CommonModule } from '@angular/common';
import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  NgModule,
  Output
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent, SearchModeInterface } from '@campus/search';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import { EduContentSearchByColumnComponent } from './edu-contents-search-by-column.component';

@Component({
  template: `
    <div></div>
  `,
  selector: 'campus-search'
})
export class SearchStubComponent {
  @Input() public searchMode;
  @Input() public autoCompleteValues;
  @Input() public autoCompleteDebounceTime;
  @Input() public initialState;
  @Input() public searchResults;
  @Input() public autoFocusSearchTerm;
  @Input() public searchPortals;
  @Output() public searchState$ = of(null);
  @Output() public searchTermChangeForAutoComplete = new EventEmitter<string>();
  reset(): void {}
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div id="page-bar-container"></div>
    <campus-edu-contents-search-by-column></campus-edu-contents-search-by-column>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [
    TestContainerComponent,
    SearchStubComponent,
    EduContentSearchByColumnComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    NoopAnimationsModule,
    SharedModule,
    RouterTestingModule
  ],
  exports: [
    TestContainerComponent,
    SearchStubComponent,
    EduContentSearchByColumnComponent
  ]
})
export class TestModule {}

const mockPath = 'the path we need';
const mockInitialSearchStateReturnValue = 'searchState function';
const mockSearchModeReturnValue: Partial<SearchModeInterface> = {
  name: 'searchMode function'
};
const mockSearchState = 'state value';
const mockSearchResults = 'results value';

describe('EduContentSearchByColumnComponent', () => {
  let component: EduContentSearchByColumnComponent;
  let fixture: ComponentFixture<EduContentSearchByColumnComponent>;
  let searchComponent;
  let eduContentsViewModel;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              routeConfig: { path: mockPath },
              params: { area: 1 }
            }
          }
        },
        {
          provide: EduContentsViewModel,
          useValue: {
            getInitialSearchState: () => of(mockInitialSearchStateReturnValue),
            getSearchMode: () => mockSearchModeReturnValue,
            updateState: () => {},
            searchState$: of(mockSearchState),
            searchResults$: of(mockSearchResults)
          }
        },
        { provide: SearchComponent, useClass: SearchStubComponent },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} }
      ]
    }).compileComponents();
    eduContentsViewModel = TestBed.get(EduContentsViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchByColumnComponent);
    searchComponent = TestBed.get(SearchComponent);
    component = fixture.componentInstance;
    component.searchComponent = searchComponent;
    component.initialize(); // manually execute initialize -> navigation hasn't triggered yet
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialize', () => {
    it('should call initialize on navigation', () => {
      component.initialize = jest.fn();
      component.ngOnInit();

      expect(component.initialize).toHaveBeenCalledTimes(1);
    });
    it('should call getSearchMode', () => {
      const getSearchModeSpy = jest.spyOn(
        eduContentsViewModel,
        'getSearchMode'
      );
      component.initialize();
      expect(getSearchModeSpy).toHaveBeenCalledTimes(1);
      expect(getSearchModeSpy).toHaveBeenCalledWith(mockPath);
    });
    it('should call the vm getInitialState and pass its return value to the initialSearchState$', () => {
      const getInitialSearchStateSpy = jest.spyOn(
        eduContentsViewModel,
        'getInitialSearchState'
      );
      component.initialize();
      expect(getInitialSearchStateSpy).toHaveBeenCalledTimes(1);
      expect(component.initialSearchState$).toBeObservable(
        hot('(a|)', { a: mockInitialSearchStateReturnValue })
      );
    });
    it('should set the correct searchState$ value', () => {
      component.initialize();
      expect(component.searchState$).toBeObservable(
        hot('(a|)', { a: mockSearchState })
      );
    });
    it('should set the correct searchResults$ value', () => {
      component.initialize();
      expect(component.searchResults$).toBeObservable(
        hot('(a|)', { a: mockSearchResults })
      );
    });
  });
  describe('onSearchStateChange', () => {
    it('should call the vm updateState method with the passed property', () => {
      const mockPassedProperty = {
        searchTerm: 'some term',
        filterCriteriaSelections: new Map<string, (number | string)[]>()
      };
      const updateStateSpy = jest.spyOn(eduContentsViewModel, 'updateState');
      component.onSearchStateChange(mockPassedProperty);
      expect(updateStateSpy).toHaveBeenCalledTimes(1);
      expect(updateStateSpy).toHaveBeenCalledWith(mockPassedProperty);
    });
  });

  describe('page bar', () => {
    let hostFixture: ComponentFixture<TestContainerComponent>;
    let pageBarDE: DebugElement;
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestContainerComponent);
      component = hostFixture.debugElement.query(
        By.directive(EduContentSearchByColumnComponent)
      ).componentInstance;
      component.searchComponent = searchComponent;
      component.initialize();
      pageBarDE = hostFixture.debugElement.query(By.css('#page-bar-container'));
    });
    it('should show the correct buttons when the searchMode is toc', () => {
      component.searchMode.name = 'toc';
      hostFixture.detectChanges();

      const buttonsNE = pageBarDE.nativeElement.querySelectorAll(
        'campus-button'
      );

      expect(buttonsNE[0].textContent).toBe('Standaard zoeken');
      expect(buttonsNE[1].textContent).toBe('Leerplan');
    });
    it('should show the correct buttons when the searchMode is plan', () => {
      component.searchMode.name = 'plan';
      hostFixture.detectChanges();

      const buttonsNE = pageBarDE.nativeElement.querySelectorAll(
        'campus-button'
      );

      expect(buttonsNE[0].textContent).toBe('Standaard zoeken');
      expect(buttonsNE[1].textContent).toBe('Inhoudstafel');
    });
  });
});
