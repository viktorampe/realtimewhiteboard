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
import { BehaviorSubject, Subject } from 'rxjs';
import { HeaderComponent } from './header.component';
import { HeaderViewModel } from './header.viewmodel';
import { MockHeaderViewModel } from './header.viewmodel.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerViewModel: MockHeaderViewModel;
  const breakpointStream: Subject<{ matches: boolean }> = new Subject();
  let pageBarNavIcon: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, MatIconModule, MatBadgeModule],
      declarations: [HeaderComponent],
      providers: [
        {
          provide: HeaderViewModel,
          useClass: MockHeaderViewModel
        },
        BreakpointObserver,
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    }).compileComponents();
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
      headerViewModel.isResolved$.next(true);
    });
    it('should show the feature components if true', () => {
      component.enableAlerts = true;
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.shared-header__app-bar__alerts'))
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

  it('should contain the element with the id page-bar-container', () => {
    expect(
      fixture.debugElement.query(By.css('#page-bar-container'))
    ).toBeTruthy();
  });

  describe('unread badge counter', () => {
    beforeEach(() => {
      headerViewModel.isResolved$.next(true);
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
      headerViewModel.isResolved$.next(true);

      // mock that we're on small sreen size
      breakpointStream.next({ matches: true });
      fixture.detectChanges();
    });
    describe('page bar navigation', () => {
      describe('when there are no higher level routes', () => {
        beforeEach(() => {
          // mock that there is no (breadcrumb) level up
          headerViewModel.backLink$.next(undefined);

          fixture.detectChanges();
          // this is the menu or arrow-back icon
          pageBarNavIcon = fixture.debugElement.query(
            By.css('.shared-header__page-bar_nav-icon')
          ).nativeElement;
        });

        it('should show the menu button', () => {
          expect(pageBarNavIcon.getAttribute('ng-reflect-svg-icon')).toBe(
            'menu'
          );
        });
        it('should toggle the side nav', () => {
          const toggleSideNavSpy = jest.spyOn(headerViewModel, 'toggleSideNav');
          pageBarNavIcon.click();
          expect(toggleSideNavSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe('when there is a higher level route', () => {
      const backLink = '/level-1';
      beforeEach(() => {
        headerViewModel.backLink$.next(backLink);
        fixture.detectChanges();
        // this is the menu or arrow-back icon
        pageBarNavIcon = fixture.debugElement.query(
          By.css('.shared-header__page-bar_nav-icon')
        ).nativeElement;
      });

      it('should show a back button', () => {
        expect(pageBarNavIcon.getAttribute('ng-reflect-svg-icon')).toBe(
          'arrow-back'
        );
      });
      it('should have the correct back link', () => {
        expect(pageBarNavIcon.getAttribute('ng-reflect-router-link')).toBe(
          backLink
        );
      });
    });
  });
});
