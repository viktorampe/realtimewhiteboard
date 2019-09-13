import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {
  MatCard,
  MatCardModule,
  MatIconRegistry,
  MatListItem
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContentBookFixture,
  EduContentFixture
} from '@campus/dal';
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
import { MethodViewModel } from '../method.viewmodel';
import { MockMethodViewModel } from '../method.viewmodel.mock';
import { MethodComponent } from './method.component';

describe('MethodComponent', () => {
  let component: MethodComponent;
  let fixture: ComponentFixture<MethodComponent>;
  let methodViewModel: MockMethodViewModel;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        NoopAnimationsModule,
        RouterTestingModule,
        UiModule,
        SharedModule
      ],
      declarations: [MethodComponent],
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
    });
  });

  beforeEach(() => {
    methodViewModel = TestBed.get(MethodViewModel);
    methodViewModel.currentMethodParams$.next({ book: 1 });
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(MethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the chapter links', () => {
    const navDE = fixture.debugElement.query(By.css('div[aside]'));
    const chapters = navDE.queryAll(By.directive(MatListItem));
    expect(chapters.length).toBe(4);
  });

  it('should show the method info card', () => {
    const methodCard = fixture.debugElement.query(By.directive(MatCard));
    expect(methodCard).toBeDefined();
  });

  describe('diabolo info', () => {
    it('should show diabolo info if the current book is diabolo', () => {
      const diaboloDE = fixture.debugElement.query(
        By.css('.method-method__container__boeke__diabolo')
      );
      const method = methodViewModel.currentMethod$.value;

      expect(diaboloDE).toBeTruthy();
      expect(diaboloDE.nativeElement.textContent.trim()).toBe(
        `${method.name} is een diabolo methode. Lees meer over diabolo`
      );
    });

    it('should not show diabolo info if the current book is diabolo', () => {
      methodViewModel.currentBook$.next(new EduContentBookFixture());
      fixture.detectChanges();

      const diaboloDE = fixture.debugElement.query(
        By.css('.method-method__container__boeke__diabolo')
      );

      expect(diaboloDE).toBeFalsy();
    });
  });

  it('should show the general files', () => {
    const generalFilesDE = fixture.debugElement.query(
      By.css('.method-method__container__files')
    );
    const generalFiles = generalFilesDE.queryAll(By.directive(MatListItem));
    expect(generalFiles.length).toBe(6);

    const productTypeHeaders = fixture.debugElement.queryAll(
      By.css('div[main] h3[mat-subheader]')
    );
    expect(productTypeHeaders.length).toBe(2);
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

  describe('clickOpenChapter', () => {
    it('should navigate to the chapter when clickOpenChapter is called', fakeAsync(() => {
      component.clickOpenChapter(3);
      tick();

      expect(router.navigate).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['methods', 1, 3], {
        queryParams: { tab: 0 }
      });
    }));

    it('should pass the tab in the queryParams when clickOpenLesson is called', fakeAsync(() => {
      const tab = 1;
      methodViewModel.currentTab$.next(tab);

      component.clickOpenChapter(3);
      tick();

      expect(router.navigate).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['methods', 1, 3], {
        queryParams: { tab }
      });
    }));
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

  describe('openboeke', () => {
    it('should call the correct method on the viewmodel', () => {
      jest.spyOn(methodViewModel, 'openBoeke');

      const mockBoeke = new EduContentFixture();
      component.clickOpenBoeke(mockBoeke);

      expect(methodViewModel.openBoeke).toHaveBeenCalledWith(mockBoeke);
    });
  });

  describe('exportGoals', () => {
    it('should call the correct method on the viewmodel', () => {
      jest.spyOn(methodViewModel, 'exportLearningPlanGoalProgress');

      component.clickExportGoals();

      expect(methodViewModel.exportLearningPlanGoalProgress).toHaveBeenCalled();
    });
  });

  describe('openGeneralFile', () => {
    it('should call the correct method on the viewmodel', () => {
      jest.spyOn(methodViewModel, 'openEduContentAsDownload');

      const eduContent = new EduContentFixture();
      component.clickOpenGeneralFile(eduContent);

      expect(methodViewModel.openEduContentAsDownload).toHaveBeenCalledWith(
        eduContent
      );
    });
  });

  describe('clickProgress', () => {
    it("should call the viewmodel's openLearningPlanGoalProgressManagementDialog()", () => {
      jest.spyOn(
        methodViewModel,
        'openLearningPlanGoalProgressManagementDialog'
      );

      const event: MultiCheckBoxTableItemChangeEventInterface<any, any, any> = {
        column: { classGroup: 'I am a classGroup' },
        item: { lpg: 'I am a learning plan goal' },
        subLevel: { foo: 'I am not relevant' },
        isChecked: true
      };

      component.clickProgress(event);

      expect(
        methodViewModel.openLearningPlanGoalProgressManagementDialog
      ).toHaveBeenCalledWith(
        { lpg: 'I am a learning plan goal' },
        { classGroup: 'I am a classGroup' }
      );
    });
    it("should call the viewmodel's deleteLearningPlanGoalProgressForLearningPlanGoalsClassGroups()", () => {
      jest.spyOn(
        methodViewModel,
        'deleteLearningPlanGoalProgressForLearningPlanGoalsClassGroups'
      );

      const event: MultiCheckBoxTableItemChangeEventInterface<any, any, any> = {
        column: { classGroup: 'I am a classGroup' },
        item: { lpg: 'I am a learning plan goal' },
        subLevel: { foo: 'I am not relevant' },
        isChecked: false
      };

      component.clickProgress(event);

      expect(
        methodViewModel.deleteLearningPlanGoalProgressForLearningPlanGoalsClassGroups
      ).toHaveBeenCalledWith(
        { lpg: 'I am a learning plan goal' },
        { classGroup: 'I am a classGroup' }
      );
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
