import { CommonModule } from '@angular/common';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params } from '@angular/router';
import {
  FilterFactoryFixture,
  SearchComponent,
  SearchModule,
  SearchStateInterface
} from '@campus/search';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { BehaviorSubject, Subject } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import {
  EduContentsViewModelMock,
  ResultItemMockComponent
} from '../edu-contents.viewmodel.mock';
import { EduContentSearchByTermComponent } from './edu-contents-search-by-term.component';

describe('EduContentSearchByTermComponent', () => {
  let params: Subject<Params>;
  let component: EduContentSearchByTermComponent;
  let fixture: ComponentFixture<EduContentSearchByTermComponent>;
  let eduContentsViewModel: EduContentsViewModel;
  let mockSearchState: SearchStateInterface = {
    searchTerm: 'foo',
    filterCriteriaSelections: new Map<string, (string | number)[]>()
  };

  beforeEach(async(() => {
    params = new BehaviorSubject<Params>({ area: 1 });
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        UiModule,
        SharedModule,
        NoopAnimationsModule,
        SearchModule,
        MatIconModule
      ],
      declarations: [EduContentSearchByTermComponent, ResultItemMockComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              routeConfig: { path: 'term' },
              params: params
            }
          }
        },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: EduContentsViewModel, useClass: EduContentsViewModelMock },
        FilterFactoryFixture
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [ResultItemMockComponent] }
      })
      .compileComponents();

    eduContentsViewModel = TestBed.get(EduContentsViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchByTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset search filters when clearSearchFilters is called', () => {
    const searchComponentDebugElement = fixture.debugElement.query(
      By.directive(SearchComponent)
    );
    const spyReset = jest.spyOn(
      searchComponentDebugElement.componentInstance,
      'reset'
    );
    component.clearSearchFilters();

    expect(spyReset).toHaveBeenCalledTimes(1);

    spyReset.mockRestore();
  });

  it('should send searchText to viewmodel subject', fakeAsync(() => {
    jest.spyOn(eduContentsViewModel, 'requestAutoComplete');

    component.onAutoCompleteRequest('foo');
    tick(500);

    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledWith(
      'foo'
    );
  }));

  it('should send searchstate to viewmodel on change', fakeAsync(() => {
    jest.spyOn(eduContentsViewModel, 'updateState');

    component.onSearchStateChange(mockSearchState);
    tick(500);

    expect(eduContentsViewModel.updateState).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.updateState).toHaveBeenCalledWith(
      mockSearchState
    );
  }));
});
