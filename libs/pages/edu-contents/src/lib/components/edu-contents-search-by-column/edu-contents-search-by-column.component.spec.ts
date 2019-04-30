import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from '@campus/search';
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
class SearchStubComponent {
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

const mockPath = 'the path we need';
const mockInitialSearchStateReturnValue = 'searchState function';
const mockSearchModeReturnValue = 'searchMode function';
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
      imports: [
        UiModule,
        SharedModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [EduContentSearchByColumnComponent, SearchStubComponent],
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
    it('should call initialise on navigation', fakeAsync(() => {
      component.initialize = jest.fn();
      router.navigate([]);
      tick();
      expect(component.initialize).toHaveBeenCalledTimes(1);
    }));
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
});
