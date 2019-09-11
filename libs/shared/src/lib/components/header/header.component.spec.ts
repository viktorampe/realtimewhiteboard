import { BreakpointObserver } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatBadgeModule,
  MatIconModule,
  MatIconRegistry
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { PERMISSION_SERVICE_TOKEN } from '../../auth';
import { HasPermissionDirective } from '../../auth/has-permission.directive';
import { CampusRouterlinkDirective } from '../../directives/campus-routerlink.directive';
import { AlertToNotificationItemPipe } from '../../pipes/alert-to-notification/alert-to-notification-pipe';
import { QuickLinkTypeEnum } from '../quick-link/quick-link-type.enum';
import { HeaderComponent } from './header.component';
import { HeaderViewModel } from './header.viewmodel';
import { MockHeaderViewModel } from './header.viewmodel.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerViewModel: MockHeaderViewModel;
  const breakpointStream: Subject<{
    matches: boolean;
    breakpoints: { [key: string]: boolean };
  }> = new Subject();
  let pageBarNavButton: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, MatIconModule, MatBadgeModule],
      declarations: [
        HeaderComponent,
        CampusRouterlinkDirective,
        HasPermissionDirective
      ],
      providers: [
        AlertToNotificationItemPipe,
        {
          provide: HeaderViewModel,
          useClass: MockHeaderViewModel
        },
        BreakpointObserver,
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: PERMISSION_SERVICE_TOKEN,
          useValue: {
            hasPermission: () => of(true)
          }
        }
      ]
    });
    headerViewModel = TestBed.get(HeaderViewModel);
    const breakpointObserver: BreakpointObserver = TestBed.get(
      BreakpointObserver
    );
    jest.spyOn(breakpointObserver, 'observe').mockReturnValue(breakpointStream);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('feature toggles', () => {
    beforeEach(() => {
      headerViewModel.alertsLoaded$.next(true);
      component.alertsPosition = 'top-right';
    });
    it('should show the feature components if true', () => {
      component.enableAlerts = true;
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.shared-header__alerts'))
      ).toBeTruthy();
    });
    it('should not show the feature components if false', () => {
      component.enableAlerts = false;

      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.shared-header__app-bar__alerts'))
      ).toBeFalsy();
    });
  });

  describe('positioning', () => {
    function expectFalsy(selector) {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector))).toBeFalsy();
    }

    function expectThruthy(selector) {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
    }

    beforeEach(() => {
      headerViewModel.alertsLoaded$.next(true);
      component.enableAlerts = true;
    });
    it('should show the alert component', () => {
      component.alertsPosition = 'top-right';
      expectThruthy('.shared-header__alerts');
    });
    it('should not show the alert component', () => {
      expectFalsy('.shared-header__app-bar__alerts');
    });

    it('should show the breadcrumbs in the app bar', () => {
      component.breadcrumbPosition = 'top-left';
      expectThruthy('campus-app-bar campus-breadcrumbs');
      expectFalsy('.shared-header__page-bar campus-breadcrumbs');
    });

    it('should show the breadcrumbs in the page bar', () => {
      component.breadcrumbPosition = 'page-left';
      expectFalsy('campus-app-bar campus-breadcrumbs');
      expectThruthy('.shared-header__page-bar campus-breadcrumbs');
    });

    it('should not show the breadcrumbs', () => {
      component.breadcrumbPosition = null;
      expectFalsy('campus-app-bar campus-breadcrumbs');
      expectFalsy('.shared-header__page-bar campus-breadcrumbs');
    });

    it('should show the globalsearch', () => {
      component.enableGlobalSearch = true;
      expectThruthy('#global-search-btn');
    });

    it('should not show the globalsearch', () => {
      component.enableGlobalSearch = false;
      expectFalsy('#global-search-btn');
    });

    it('should show the profileMenu', () => {
      component.profileMenuPosition = 'top-right';
      expectThruthy('.shared-header__profile-menu');
    });

    it('should hide the profileMenu', () => {
      component.profileMenuPosition = null;
      expectFalsy('.shared-header__profile-menu');
    });

    it('should show the profileLink', () => {
      component.profileLinkPosition = 'top-right';
      expectThruthy('#global-profile-btn');
    });

    it('should hide the profileLink', () => {
      component.profileMenuPosition = null;
      expectFalsy('#global-profile-btn');
    });

    it('should show the quicklinks in the app bar', () => {
      component.quicklinkPosition = 'top-right';
      expectThruthy('campus-app-bar #global-history-btn');
      expectThruthy('campus-app-bar #global-favorites-btn');
      expectFalsy('.shared-header__page-bar #global-history-btn');
      expectFalsy('.shared-header__page-bar #global-favorites-btn');
    });

    it('should show the quicklinks in the page bar', () => {
      component.quicklinkPosition = 'page-right';
      expectFalsy('campus-app-bar #global-history-btn');
      expectFalsy('campus-app-bar #global-favorites-btn');
      expectThruthy('.shared-header__page-bar #global-history-btn');
      expectThruthy('.shared-header__page-bar #global-favorites-btn');
    });

    it('should not show the quicklinks', () => {
      component.quicklinkPosition = null;
      expectFalsy('#global-history-btn');
      expectFalsy('#global-favorites-btn');
    });
  });

  it('should contain the element with the id page-bar-container', () => {
    expect(
      fixture.debugElement.query(By.css('#page-bar-container'))
    ).toBeTruthy();
  });

  describe('unread badge counter', () => {
    beforeEach(() => {
      headerViewModel.alertsLoaded$.next(true);
      component.alertsPosition = 'top-right';
      fixture.detectChanges();
    });
    it('should show the badge if the unreadAlertCount$ is bigger than 0', () => {
      component.unreadAlertCount$ = new BehaviorSubject<number>(11);
      fixture.detectChanges();
      expect(component.unreadAlertCount$).toBeObservable(hot('a', { a: 11 }));
      const badge = fixture.nativeElement.querySelector('.mat-badge-content');
      expect(badge.textContent).toBe('11');
      expect(badge.parentElement.className).not.toContain('mat-badge-hidden');
    });
    it('should show the badge if the unreadAlertCount$ is 0', () => {
      component.unreadAlertCount$ = new BehaviorSubject<number>(0);
      fixture.detectChanges();
      expect(component.unreadAlertCount$).toBeObservable(hot('a', { a: 0 }));
      const badge = fixture.nativeElement.querySelector('.mat-badge-content');
      expect(badge.parentElement.className).toContain('mat-badge-hidden');
    });
    it('should show the badge if the unreadAlertCount$ is negative', () => {
      component.unreadAlertCount$ = new BehaviorSubject<number>(-29);
      fixture.detectChanges();
      expect(component.unreadAlertCount$).toBeObservable(hot('a', { a: -29 }));
      const badge = fixture.nativeElement.querySelector('.mat-badge-content');
      expect(badge.parentElement.className).toContain('mat-badge-hidden');
    });
  });

  describe('should be mobile friendly', () => {
    beforeEach(() => {
      headerViewModel.alertsLoaded$.next(true);

      // mock that we're on small sreen size
      breakpointStream.next({ matches: true, breakpoints: {} });
      fixture.detectChanges();
    });
    describe('page bar navigation', () => {
      describe('when there are no higher level routes', () => {
        beforeEach(() => {
          // mock that there is no (breadcrumb) level up
          headerViewModel.backLink$.next(undefined);

          fixture.detectChanges();
          // this is the menu or arrow-back button
          pageBarNavButton = fixture.debugElement.query(
            By.css('.shared-header__page-bar__nav-button')
          ).nativeElement;
        });

        it('should show the menu button', () => {
          expect(pageBarNavButton.getAttribute('ng-reflect-icon-class')).toBe(
            'menu'
          );
        });
        it('should toggle the side nav', () => {
          const toggleSideNavSpy = jest.spyOn(headerViewModel, 'toggleSideNav');
          pageBarNavButton.click();
          expect(toggleSideNavSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe('when there is a higher level route', () => {
      const backLink = '/level-1';
      beforeEach(() => {
        headerViewModel.backLink$.next(backLink);
        fixture.detectChanges();
        // this is the menu or arrow-back button
        pageBarNavButton = fixture.debugElement.query(
          By.css('.shared-header__page-bar__nav-button')
        ).nativeElement;
      });

      it('should show a back button', () => {
        expect(pageBarNavButton.getAttribute('ng-reflect-icon-class')).toBe(
          'arrow-back'
        );
      });
      it('should have the correct back link', () => {
        expect(pageBarNavButton.getAttribute('ng-reflect-router-link')).toBe(
          backLink
        );
      });
    });
  });

  describe('quicklinks', () => {
    it('should call header vm method for favorites', () => {
      const spy = jest.spyOn(headerViewModel, 'openDialog');
      component.onManageFavoritesClick();
      expect(spy).toHaveBeenCalledWith(QuickLinkTypeEnum.FAVORITES);
    });

    it('should call header vm method for history', () => {
      const spy = jest.spyOn(headerViewModel, 'openDialog');
      component.onManageHistoryClick();
      expect(spy).toHaveBeenCalledWith(QuickLinkTypeEnum.HISTORY);
    });
  });
});
