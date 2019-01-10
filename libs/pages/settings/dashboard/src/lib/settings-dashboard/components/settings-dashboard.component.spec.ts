import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN,
  SharedModule
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { Observable, of } from 'rxjs';
import { SettingsDashboardComponent } from './settings-dashboard.component';

class MockPermissionService implements PermissionServiceInterface {
  hasPermission(
    requiredPermissions: string | (string | string[])[]
  ): Observable<boolean> {
    return of(true);
  }
}

describe('SettingsDashboardComponent', () => {
  let component: SettingsDashboardComponent;
  let fixture: ComponentFixture<SettingsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsDashboardComponent],
      imports: [UiModule, MatListModule, RouterModule, SharedModule],
      providers: [
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        {
          provide: PERMISSION_SERVICE_TOKEN,
          useValue: MockPermissionService
        }
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
});
