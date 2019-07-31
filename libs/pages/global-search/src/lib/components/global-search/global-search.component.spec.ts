/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ResultItemMockComponent,
  SearchComponent,
  SearchTestModule
} from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  SharedModule
} from '@campus/shared';
import { ViewModelInterface } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { GlobalSearchViewModel } from '../global-search.viewmodel';
import { MockGlobalSearchViewModel } from '../global-search.viewmodel.mock';
import { GlobalSearchComponent } from './global-search.component';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let searchComponent;
  let globalSearchViewModel: ViewModelInterface<GlobalSearchViewModel>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalSearchComponent],
      imports: [
        SearchTestModule,
        NoopAnimationsModule,
        UiModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        { provide: GlobalSearchViewModel, useClass: MockGlobalSearchViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });

    router = TestBed.get(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    searchComponent = TestBed.get(SearchComponent);
    globalSearchViewModel = TestBed.get(GlobalSearchViewModel);
    component.searchComponent = searchComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
