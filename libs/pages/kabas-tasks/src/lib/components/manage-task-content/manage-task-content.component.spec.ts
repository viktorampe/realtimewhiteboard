import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ResultItemMockComponent,
  SearchComponent,
  SearchStateInterface,
  SearchTestModule
} from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { ManageTaskContentComponent } from './manage-task-content.component';

describe('ManageTaskContentComponent', () => {
  let component: ManageTaskContentComponent;
  let fixture: ComponentFixture<ManageTaskContentComponent>;

  let searchComponent;
  let viewModel: KabasTasksViewModel;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        NoopAnimationsModule,
        SearchTestModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [ManageTaskContentComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });
    router = TestBed.get(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTaskContentComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(KabasTasksViewModel);

    searchComponent = TestBed.get(SearchComponent);
    component.searchComponent = searchComponent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    let mockSearchState;

    beforeEach(() => {
      mockSearchState = {
        searchTerm: 'breuken'
      } as SearchStateInterface;
    });

    it('should reset search filters when clearSearchFilters is called', () => {
      component.searchComponent.reset = jest.fn();
      component.clearSearchFilters();

      expect(component.searchComponent.reset).toHaveBeenCalledTimes(1);
    });

    it('should send searchText to viewmodel subject', () => {
      jest.spyOn(viewModel, 'requestAutoComplete');

      component.onAutoCompleteRequest('foo');

      expect(viewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
      expect(viewModel.requestAutoComplete).toHaveBeenCalledWith('foo');
    });

    it('should send searchstate to viewmodel on change', () => {
      jest.spyOn(viewModel, 'updateSearchState');

      component.onSearchStateChange(mockSearchState);

      expect(viewModel.updateSearchState).toHaveBeenCalledTimes(1);
      expect(viewModel.updateSearchState).toHaveBeenCalledWith(mockSearchState);
    });
  });
  describe('clickOpenToc', () => {
    it('should navigate to the lesson when clickOpenToc is called', () => {
      component.selectTOC(1, 0);
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { chapterId: 1 }
      });
    });

    it('should navigate to the chapter when clickOpenToc is called', () => {
      component.selectTOC(2, 1);
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { lessonId: 2 }
      });
    });
  });
});
