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
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FilterFactoryFixture,
  SearchComponent,
  SearchStateInterface
} from '@campus/search';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import {
  EduContentsViewModelMock,
  ResultItemMockComponent
} from '../edu-contents.viewmodel.mock';
import { EduContentSearchByTermComponent } from './edu-contents-search-by-term.component';

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
    <campus-edu-contents-search-by-term></campus-edu-contents-search-by-term>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [
    TestContainerComponent,
    SearchStubComponent,
    EduContentSearchByTermComponent
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
    EduContentSearchByTermComponent
  ]
})
export class TestModule {}

describe('EduContentSearchByTermComponent', () => {
  let params: Subject<Params>;
  let component: EduContentSearchByTermComponent;
  let fixture: ComponentFixture<EduContentSearchByTermComponent>;
  let eduContentsViewModel: EduContentsViewModel;
  const mockSearchState: SearchStateInterface = {
    searchTerm: 'foo',
    filterCriteriaSelections: new Map<string, (string | number)[]>()
  };
  let searchComponent;

  beforeEach(async(() => {
    params = new BehaviorSubject<Params>({ area: 1 });
    TestBed.configureTestingModule({
      imports: [TestModule, MatIconModule],
      declarations: [ResultItemMockComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ActivatedRoute,
          useValue: {
            routeConfig: { path: 'term' },
            params: of(params)
          }
        },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: EduContentsViewModel, useClass: EduContentsViewModelMock },
        FilterFactoryFixture,
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: SearchComponent, useValue: SearchStubComponent }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });

    eduContentsViewModel = TestBed.get(EduContentsViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchByTermComponent);
    component = fixture.componentInstance;
    searchComponent = TestBed.get(SearchComponent);
    component.searchComponent = searchComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset search filters when clearSearchFilters is called', () => {
    component.searchComponent.reset = jest.fn();
    component.clearSearchFilters();

    expect(component.searchComponent.reset).toHaveBeenCalledTimes(1);
  });

  it('should send searchText to viewmodel subject', () => {
    jest.spyOn(eduContentsViewModel, 'requestAutoComplete');

    component.onAutoCompleteRequest('foo');

    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledWith(
      'foo'
    );
  });

  it('should send searchstate to viewmodel on change', () => {
    jest.spyOn(eduContentsViewModel, 'updateState');

    component.onSearchStateChange(mockSearchState);

    expect(eduContentsViewModel.updateState).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.updateState).toHaveBeenCalledWith(
      mockSearchState
    );
  });

  describe('searchterm input autofocus', () => {
    it('should have autofocus on if no searchterm present', () => {
      (eduContentsViewModel.searchState$ as BehaviorSubject<
        SearchStateInterface
      >).next({
        searchTerm: '',
        filterCriteriaSelections: new Map<string, (string | number)[]>()
      });

      component.ngOnInit();

      expect(component.autoFocusSearchTerm).toBe(true);
    });

    it('should have autofocus off if searchterm is present', () => {
      expect(component.autoFocusSearchTerm).toBe(false);
    });
  });

  describe('page bar', () => {
    let hostFixture: ComponentFixture<TestContainerComponent>;
    let pageBarDE: DebugElement;
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestContainerComponent);
      component = hostFixture.debugElement.query(
        By.directive(EduContentSearchByTermComponent)
      ).componentInstance;
      component.searchComponent = searchComponent;

      pageBarDE = hostFixture.debugElement.query(By.css('#page-bar-container'));
      hostFixture.detectChanges();
    });
    it('should not show buttons when there is no currentLearningArea', () => {
      component.currentLearningArea = undefined;
      hostFixture.detectChanges();

      const buttonsNE = pageBarDE.nativeElement.querySelectorAll(
        'campus-button'
      );

      expect(buttonsNE.length).toBe(0);
    });
    it('should show the correct buttons when there is a currentLearningArea', () => {
      component.currentLearningArea = 1;
      hostFixture.detectChanges();

      const buttonsNE = pageBarDE.nativeElement.querySelectorAll(
        'campus-button'
      );

      expect(buttonsNE[0].textContent).toBe('Leerplan');
      expect(buttonsNE[1].textContent).toBe('Inhoudstafel');
    });
  });
});
