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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, MatIconModule],
      declarations: [HeaderComponent],
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

  describe('should be responsive', () => {
    it('should show the menu button when we are on the base route', () => {
      component.pageBarNavItem$ = of({ icon: 'arrow-back', link: ['/'] });
      breakpointStream.next({ matches: true });

      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(
        By.css('.shared-header__page-bar_nav-icon')
      );
      expect(debugEl.nativeElement.style.display).toBe('none');
    });
  });
});
