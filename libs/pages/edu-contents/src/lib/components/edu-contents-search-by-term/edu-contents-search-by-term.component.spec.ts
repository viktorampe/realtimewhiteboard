import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params } from '@angular/router';
import {
  FilterFactoryFixture,
  SearchComponent,
  SearchModule
} from '@campus/search';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
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

  beforeEach(async(() => {
    params = new BehaviorSubject<Params>({ area: 1 });
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        UiModule,
        SharedModule,
        NoopAnimationsModule,
        SearchModule
      ],
      declarations: [EduContentSearchByTermComponent, ResultItemMockComponent],
      providers: [
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchByTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should reset search filters when clearSearchFilters is called', () => {
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
});
