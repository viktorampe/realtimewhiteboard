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

  const userPermissions: string[] = ['permissions1', 'permissions2'];

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
    expect(navlist.children.length).toBe(5);
  });

  it('navitem should be populated with the correct name', () => {
    const navlist =
      fixture.debugElement.children[0].children[1].children[0].children[0];
    const navItem = navlist.children[0];
    expect(navItem.nativeElement.textContent).toContain('Mijn gegevens');
  });

  it('it should navigate correctly', () => {
    component.navigateTo('/test');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(['/test']);
  });

  it('should return true if no special permissions required', () => {
    expect(component.hasPermission(null, userPermissions)).toBeTruthy();
  });

  it('should return false if userpermissions does not include given permissions', () => {
    expect(
      component.hasPermission(['permission3'], userPermissions)
    ).toBeFalsy();
  });

  it('should return true if userpermissions does include given permissions', () => {
    expect(
      component.hasPermission([userPermissions[0]], userPermissions)
    ).toBeTruthy();
  });

  it('should return true if userpermissions does not include given permissions when others are', () => {
    expect(
      component.hasPermission(
        [userPermissions[0], userPermissions[1], 'not included'],
        userPermissions
      )
    ).toBeFalsy();
  });
});
