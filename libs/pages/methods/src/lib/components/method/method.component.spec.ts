import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatCard, MatCardModule, MatListItem } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EduContentFixture } from '@campus/dal';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  SharedModule
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { MethodViewModel } from '../method.viewmodel';
import { MockMethodViewModel } from '../method.viewmodel.mock';
import { MethodComponent } from './method.component';

describe('MethodComponent', () => {
  let component: MethodComponent;
  let fixture: ComponentFixture<MethodComponent>;
  let methodViewModel: MockMethodViewModel;
  let params: BehaviorSubject<Params>;
  let router: Router;

  configureTestSuite(() => {
    params = new BehaviorSubject<Params>({ book: 1 });
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
    });
  });

  beforeEach(() => {
    methodViewModel = TestBed.get(MethodViewModel);
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

  describe('clickOpenChapter', () => {
    it('should navigate to the chapter when clickOpenChapter is called', fakeAsync(() => {
      const navigate = jest.spyOn(router, 'navigate');

      component.clickOpenChapter(3);
      tick();

      expect(navigate).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith(['methods', 1, 3], {
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

        const navigate = jest.spyOn(router, 'navigate');

        component.onSelectedTabIndexChanged(tab);

        expect(navigate).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith([], {
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
});
