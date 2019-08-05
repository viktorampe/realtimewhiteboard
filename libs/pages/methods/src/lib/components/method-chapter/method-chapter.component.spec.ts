import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EduContentFixture } from '@campus/dal';
import {
  ResultItemMockComponent,
  SearchComponent,
  SearchStateInterface,
  SearchTestModule
} from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  SharedModule
} from '@campus/shared';
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
  let methodViewModel: MockMethodViewModel;
  let router: Router;

  configureTestSuite(() => {
    params = new BehaviorSubject<Params>({ book: 1, chapter: 2 });

    TestBed.configureTestingModule({
      imports: [
        SearchTestModule,
        NoopAnimationsModule,
        UiModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [MethodChapterComponent],
      providers: [
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: ActivatedRoute,
          useValue: { params, snapshot: { params: params.value } }
        },
        { provide: MethodViewModel, useClass: MockMethodViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });

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
        By.css('.method-chapter__back-link')
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
        By.css('.method-chapter__lesson-link')
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

    describe('clickBackLink', () => {
      it('should navigate up to the book when inside a chapter', fakeAsync(() => {
        component.clickBackLink();
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['methods', 1], {
          queryParams: { tab: 0 }
        });
      }));

      it('should navigate up to the chapter when inside a lesson', fakeAsync(() => {
        component.currentLessonId = 3;

        component.clickBackLink();
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['methods', 1, 2], {
          queryParams: { tab: 0 }
        });
      }));

      it('should pass the tab in the queryParams when going back', fakeAsync(() => {
        const tab = 1;
        methodViewModel.currentTab$.next(tab);

        component.clickBackLink();
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['methods', 1], {
          queryParams: { tab }
        });
      }));
    });

    describe('clickOpenLesson', () => {
      it('should navigate to the lesson when clickOpenLesson is called', fakeAsync(() => {
        component.clickOpenLesson(3);
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['methods', 1, 2, 3], {
          queryParams: { tab: 0 }
        });
      }));

      it('should pass the tab in the queryParams when clickOpenLesson is called', fakeAsync(() => {
        const tab = 1;
        methodViewModel.currentTab$.next(tab);

        component.clickOpenLesson(3);
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['methods', 1, 2, 3], {
          queryParams: { tab }
        });
      }));
    });
  });

  describe('tabs', () => {
    describe('onSelectedTabIndexChanged', () => {
      it('should navigate with the new tab index in the queryParams', () => {
        const tab = 1;

        component.onSelectedTabIndexChanged(tab);

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([], {
          queryParams: { tab }
        });
      });
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

  describe('openboeke', () => {
    it('should call the correct method on the viewmodel', () => {
      jest.spyOn(methodViewModel, 'openBoeke');

      const mockBoeke = new EduContentFixture();
      component.clickOpenBoeke(mockBoeke);

      expect(methodViewModel.openBoeke).toHaveBeenCalledWith(mockBoeke);
    });
  });
});
