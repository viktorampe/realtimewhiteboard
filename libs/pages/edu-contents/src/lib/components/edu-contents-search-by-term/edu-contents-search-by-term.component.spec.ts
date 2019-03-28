import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  FilterFactoryFixture,
  SearchComponent,
  SearchModule
} from '@campus/search';
import { UiModule } from '@campus/ui';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import {
  EduContentsViewModelMock,
  ResultItemMockComponent
} from '../edu-contents.viewmodel.mock';
import { EduContentSearchByTermComponent } from './edu-contents-search-by-term.component';

describe('EduContentSearchByTermComponent', () => {
  let component: EduContentSearchByTermComponent;
  let fixture: ComponentFixture<EduContentSearchByTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, UiModule, NoopAnimationsModule, SearchModule],
      declarations: [EduContentSearchByTermComponent, ResultItemMockComponent],
      providers: [
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
