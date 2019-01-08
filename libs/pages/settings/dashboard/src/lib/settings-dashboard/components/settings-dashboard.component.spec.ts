import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material';
import { Router } from '@angular/router';
import { AuthServiceInterface, AUTH_SERVICE_TOKEN } from '@campus/dal';
import { UiModule } from '@campus/ui';
import { Observable, of } from 'rxjs';
import { SettingsDashboardComponent } from './settings-dashboard.component';

describe('SettingsDashboardComponent', () => {
  let component: SettingsDashboardComponent;
  let fixture: ComponentFixture<SettingsDashboardComponent>;
  const spy = jest.fn();

  class MockRouter {
    navigate = spy;
  }

  class MockAuth implements AuthServiceInterface {
    userId: number;
    getCurrent(): Observable<any> {
      throw new Error('Method not implemented.');
    }
    logout(): Observable<any> {
      throw new Error('Method not implemented.');
    }
    login(
      credentials: Partial<
        import('/Users/melvin.kellner/Desktop/projects/campus/libs/dal/src/index').LoginCredentials
      >
    ): Observable<any> {
      throw new Error('Method not implemented.');
    }
    isLoggedIn(): boolean {
      return true;
    }

    getPermissions(): Observable<string[]> {
      return of(['permission1']);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsDashboardComponent],
      imports: [UiModule, MatListModule],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AUTH_SERVICE_TOKEN, useClass: MockAuth }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct number of links', () => {
    const navlist =
      fixture.debugElement.children[0].children[1].children[0].children[0];
    expect(navlist.children.length).toBe(7);
  });

  it('navitem should be populated with the correct name', () => {
    const navlist =
      fixture.debugElement.children[0].children[1].children[0].children[0];
    const navItem = navlist.children[0];
    expect(navItem.nativeElement.textContent).toContain('link1');
  });

  it('it should navigate correctly', () => {
    component.navigateTo('/test');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(['/test']);
  });

  it('should return true if no permissions', () => {
    component.hasPermission(null).subscribe(bool => {
      expect(bool).toBeTruthy();
    });
  });

  it('should return false if no user does not have permissions required', () => {
    const sub = component.hasPermission(['some permission']).subscribe(bool => {
      expect(bool).toBeFalsy();
      sub.unsubscribe();
    });
  });

  it('should return true if no user has permissions required', () => {
    const sub = component.hasPermission(['permission1']).subscribe(bool => {
      expect(bool).toBeTruthy();
      sub.unsubscribe();
    });
  });
});
