import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbLinkInterface, UiModule } from '@campus/ui';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { HeaderComponent } from './header.component';
import { HeaderViewModel, mockBreadCrumbs } from './header.viewmodel';
import { RouterLinkDirectiveStub } from './router-link-directive.stub';
// file.only
@Injectable({
  providedIn: 'root'
})
export class MockHeaderViewModel {
  enableAlerts: true;
  enableMessages: true;
  breadCrumbs$ = new BehaviorSubject<BreadcrumbLinkInterface[]>(
    mockBreadCrumbs
  );
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerViewModel: MockHeaderViewModel;
  const breakpointStream: Subject<{ matches: boolean }> = new Subject();
  let pageBarNavIcon: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, MatIconModule],
      declarations: [HeaderComponent, RouterLinkDirectiveStub],
      providers: [
        {
          provide: HeaderViewModel,
          useClass: MockHeaderViewModel
        },
        BreakpointObserver
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
    it('should show the feature components if true', () => {
      component.enableAlerts = true;
      component.enableMessages = true;
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.shared-header__app-bar__alerts'))
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('.shared-header__app-bar__messages'))
      ).toBeTruthy();
    });
    it('should not show the feature components if false', () => {
      component.enableAlerts = false;
      component.enableMessages = false;
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.shared-header__app-bar__alerts'))
      ).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('.shared-header__app-bar__messages'))
      ).toBeFalsy();
    });
  });

  it('should contain the element with the id page-bar-container', () => {
    expect(
      fixture.debugElement.query(By.css('#page-bar-container'))
    ).toBeTruthy();
  });

  describe('should be mobile friendly', () => {
    beforeEach(() => {
      // mock that we're on small sreen size
      breakpointStream.next({ matches: true });
      fixture.detectChanges();

      // this is the menu or arrow-back icon
      pageBarNavIcon = fixture.debugElement.query(
        By.css('.shared-header__page-bar_nav-icon')
      ).nativeElement;
    });
    describe('page bar navigation', () => {
      describe('when there are no higher level routes', () => {
        beforeEach(() => {
          // mock that there is no (breadcrumb) level up
          component.backLink$ = of(undefined);
          fixture.detectChanges();
        });

        it('should show the menu button', () => {
          fixture.detectChanges();
          const debugEl: HTMLElement = fixture.debugElement.query(
            By.css('.shared-header__page-bar_nav-icon')
          ).nativeElement;
          expect(debugEl.getAttribute('ng-reflect-svg-icon')).toBe('menu');
        });
        it('should toggle the side nav', () => {
          const spy: jest.SpyInstance = jest.spyOn(component, 'onMenuClick');
          const debugEl: HTMLElement = fixture.debugElement.query(
            By.css('.shared-header__page-bar_nav-icon')
          ).nativeElement;
          debugEl.click();
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe('when there is a higher level route', () => {
      let routerLinks: RouterLinkDirectiveStub[];
      beforeEach(() => {
        component.backLink$ = of(['/level-2']);
        fixture.detectChanges();
        // find DebugElements with an attached RouterLinkStubDirective
        const linkDes = fixture.debugElement.queryAll(
          By.directive(RouterLinkDirectiveStub)
        );

        routerLinks = linkDes.map(de =>
          de.injector.get(RouterLinkDirectiveStub)
        );
      });
      beforeAll(() => {});
      it('should show a back button', () => {
        const debugEl: HTMLElement = fixture.debugElement.query(
          By.css('.shared-header__page-bar_nav-icon')
        ).nativeElement;
        expect(debugEl.getAttribute('ng-reflect-svg-icon')).toBe('arrow-back');
      });
      it('should navigate back', () => {
        pageBarNavIcon.click();
        expect(routerLinks[0].linkParams).toEqual(['/level-2']);
      });
    });
  });
});
