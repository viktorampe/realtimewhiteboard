import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ResultItemMockComponent,
  SearchComponent,
  SearchStateInterface,
  SearchTestModule
} from '@campus/search';
import { ViewModelInterface } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { MethodViewModel } from './../method.viewmodel';
import { MockMethodViewModel } from './../method.viewmodel.mock';
import { MethodChapterComponent } from './method-chapter.component';

describe('MethodChapterComponent', () => {
  let component: MethodChapterComponent;
  let fixture: ComponentFixture<MethodChapterComponent>;
  let searchComponent;
  let params: BehaviorSubject<Params>;
  let methodViewModel: ViewModelInterface<MethodViewModel>;
  let router: Router;

  configureTestSuite(() => {
    params = new BehaviorSubject<Params>({ book: 1, chapter: 1 });

    TestBed.configureTestingModule({
      imports: [
        SearchTestModule,
        NoopAnimationsModule,
        UiModule,
        RouterTestingModule
      ],
      declarations: [MethodChapterComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: ActivatedRoute,
          useValue: { params, snapshot: { params: params.value } }
        },
        { provide: MethodViewModel, useClass: MockMethodViewModel }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });

    methodViewModel = TestBed.get(MethodViewModel);
    router = TestBed.get(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodChapterComponent);
    component = fixture.componentInstance;
    searchComponent = TestBed.get(SearchComponent);
    methodViewModel = TestBed.get(MethodViewModel);
    component.searchComponent = searchComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigation', () => {
    it('should have a back button that calls clickBackLink()', () => {
      const backDE = fixture.debugElement.query(
        By.css('.method-chapter__container__sheet__back-link')
      );

      expect(backDE.nativeElement.textContent).toBe('Terug');

      const clickBackLink = jest
        .spyOn(component, 'clickBackLink')
        .mockImplementation();
      backDE.nativeElement.click();
      expect(clickBackLink).toHaveBeenCalled();
    });

    it('should show the toc navigation links', done => {
      const lessonLinkDEs = fixture.debugElement.queryAll(
        By.css('.method-chapter__container__sheet__lesson-link')
      );

      methodViewModel.currentToc$.subscribe(tocs => {
        lessonLinkDEs.forEach((lessonLinkDE, index) => {
          const toc = tocs[index];

          expect(lessonLinkDE.nativeElement.textContent).toBe(toc.title);

          const clickOpenLesson = jest
            .spyOn(component, 'clickOpenLesson')
            .mockImplementation();

          lessonLinkDE.nativeElement.click();

          expect(clickOpenLesson).toHaveBeenCalled();
          expect(clickOpenLesson).toHaveBeenCalledWith(toc.id);
        });

        done();
      });
    });

    it('should navigate up one level when clickBackLink is called', () => {
      component.clickBackLink();

      expect(router.navigate).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['methods', 1]);
    });

    it('should navigate to the lesson when clickOpenLesson is called', () => {
      component.clickOpenLesson(2);

      expect(router.navigate).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['methods', 1, 1, 2]);
    });
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
      jest.spyOn(methodViewModel, 'requestAutoComplete');

      component.onAutoCompleteRequest('foo');

      expect(methodViewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
      expect(methodViewModel.requestAutoComplete).toHaveBeenCalledWith('foo');
    });

    it('should send searchstate to viewmodel on change', () => {
      jest.spyOn(methodViewModel, 'updateState');

      component.onSearchStateChange(mockSearchState);

      expect(methodViewModel.updateState).toHaveBeenCalledTimes(1);
      expect(methodViewModel.updateState).toHaveBeenCalledWith(mockSearchState);
    });
  });
});
