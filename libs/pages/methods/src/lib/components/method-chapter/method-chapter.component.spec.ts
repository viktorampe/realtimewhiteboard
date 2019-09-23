import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContentFixture,
  EduContentTOCFixture,
  EduContentTOCInterface,
  LearningPlanGoalFixture,
  LearningPlanGoalInterface
} from '@campus/dal';
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
import {
  MultiCheckBoxTableItemChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  UiModule
} from '@campus/ui';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { MethodViewModel } from './../method.viewmodel';
import { MockMethodViewModel } from './../method.viewmodel.mock';
import { MethodChapterComponent } from './method-chapter.component';

describe('MethodChapterComponent', () => {
  let component: MethodChapterComponent;
  let fixture: ComponentFixture<MethodChapterComponent>;
  let searchComponent;
  let methodViewModel: MockMethodViewModel;
  let router: Router;

  configureTestSuite(() => {
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
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        { provide: MethodViewModel, useClass: MockMethodViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
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
    methodViewModel.currentMethodParams$.next({ book: 3599752219, chapter: 2 });
    component.searchComponent = searchComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert the filteredClassGroups$ to tableHeaders', () => {
    const expectedGroupColumns: MultiCheckBoxTableItemColumnInterface<
      ClassGroupInterface
    >[] = [
      {
        item: new ClassGroupFixture({ id: 1, name: '1a' }),
        key: 'id',
        label: 'name'
      },
      {
        item: new ClassGroupFixture({ id: 2, name: '1b' }),
        key: 'id',
        label: 'name'
      }
    ];
    expect(component.classGroupColumns$).toBeObservable(
      hot('a', {
        a: expectedGroupColumns
      })
    );
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
            .spyOn(component, 'clickOpenToc')
            .mockImplementation();

          lessonLinkDE.nativeElement.click();

          expect(clickOpenLesson).toHaveBeenCalled();
          expect(clickOpenLesson).toHaveBeenCalledWith(toc.id, toc.depth);
        });

        done();
      });
    });

    describe('clickBackLink', () => {
      it('should navigate up to the book when inside a chapter', fakeAsync(() => {
        component.clickBackLink();
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['methods', 3599752219], {
          queryParams: { tab: 0 }
        });
      }));

      it('should navigate up to the chapter when inside a lesson', fakeAsync(() => {
        methodViewModel.currentMethodParams$.next({
          ...methodViewModel.currentMethodParams$.value,
          lesson: 3
        });

        component.clickBackLink();
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(
          ['methods', 3599752219, 2],
          {
            queryParams: { tab: 0 }
          }
        );
      }));

      it('should pass the tab in the queryParams when going back', fakeAsync(() => {
        const tab = 1;
        methodViewModel.currentTab$.next(tab);

        component.clickBackLink();
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['methods', 3599752219], {
          queryParams: { tab }
        });
      }));
    });

    describe('clickOpenLesson', () => {
      it('should navigate to the lesson when clickOpenLesson is called', fakeAsync(() => {
        component.clickOpenToc(3);
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(
          ['methods', 3599752219, 2, 3],
          {
            queryParams: { tab: 0 }
          }
        );
      }));

      it('should pass the tab in the queryParams when clickOpenLesson is called', fakeAsync(() => {
        const tab = 1;
        methodViewModel.currentTab$.next(tab);

        component.clickOpenToc(3);
        tick();

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(
          ['methods', 3599752219, 2, 3],
          {
            queryParams: { tab }
          }
        );
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

  describe('MultiCheckBoxTable event handlers', () => {
    describe('checkBoxChanged', () => {
      it('should call onLearningPlanGoalProgressChanged on the viewmodel with the right arguments', () => {
        jest.spyOn(methodViewModel, 'onLearningPlanGoalProgressChanged');

        const changeEvent = {
          column: new ClassGroupFixture({ id: 1 }),
          item: new LearningPlanGoalFixture({ id: 2 }),
          subLevel: new EduContentTOCFixture({ id: 3 })
        } as MultiCheckBoxTableItemChangeEventInterface<
          LearningPlanGoalInterface,
          ClassGroupInterface,
          EduContentTOCInterface
        >;

        component.checkBoxChanged(changeEvent);

        expect(
          methodViewModel.onLearningPlanGoalProgressChanged
        ).toHaveBeenCalled();
        expect(
          methodViewModel.onLearningPlanGoalProgressChanged
        ).toHaveBeenCalledWith(1, 2, 3, null, 3599752219);
      });
    });

    describe('checkBoxesChanged', () => {
      it('should not call onBulkLearningPlanGoalProgressChanged on the viewmodel if the array is empty', () => {
        jest.spyOn(methodViewModel, 'onBulkLearningPlanGoalProgressChanged');

        component.checkBoxesChanged([]);

        expect(
          methodViewModel.onBulkLearningPlanGoalProgressChanged
        ).not.toHaveBeenCalled();
      });

      it('should call onBulkLearningPlanGoalProgressChanged on the viewmodel with the right arguments', () => {
        jest.spyOn(methodViewModel, 'onBulkLearningPlanGoalProgressChanged');

        const column = new ClassGroupFixture({ id: 1 });
        const subLevel = new EduContentTOCFixture({ id: 4 });
        const changeEvents = [
          {
            column,
            item: new LearningPlanGoalFixture({ id: 2 }),
            subLevel
          },
          {
            column,
            item: new LearningPlanGoalFixture({ id: 3 }),
            subLevel
          }
        ] as MultiCheckBoxTableItemChangeEventInterface<
          LearningPlanGoalInterface,
          ClassGroupInterface,
          EduContentTOCInterface
        >[];

        component.checkBoxesChanged(changeEvents);

        expect(
          methodViewModel.onBulkLearningPlanGoalProgressChanged
        ).toHaveBeenCalled();
        expect(
          methodViewModel.onBulkLearningPlanGoalProgressChanged
        ).toHaveBeenCalledWith(1, [2, 3], 4, 3599752219);
      });
    });
  });

  describe('toggleBoekeFavorite', () => {
    it('should call the correct method on the viewmodel', () => {
      jest.spyOn(methodViewModel, 'toggleBoekeFavorite');
      const boeke = new EduContentFixture({ id: 123 }, { learningAreaId: 456 });

      component.toggleBoekeFavorite(boeke);
      expect(methodViewModel.toggleBoekeFavorite).toHaveBeenCalledWith(boeke);
    });
  });
});
