import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN,
  SharedModule
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { Observable, of } from 'rxjs';
import { SettingsDashboardComponent } from './settings-dashboard.component';
import { SettingsDashboardViewModel } from './settings-dashboard.viewmodel';
import { MockSettingsDashboardViewModel } from './settings-dashboard.viewmodel.mock';

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
      imports: [UiModule, MatListModule, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        {
          provide: PERMISSION_SERVICE_TOKEN,
          useClass: MockPermissionService
        },
        {
          provide: SettingsDashboardViewModel,
          useClass: MockSettingsDashboardViewModel
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
    const buttons = fixture.debugElement.queryAll(By.css('campus-button'));
    expect(buttons.length).toBe(5);
  });

  it('navitem should be populated with the correct name', () => {
    const buttons = fixture.debugElement.queryAll(By.css('campus-button'));
    expect(buttons[0].nativeElement.textContent).toContain('Mijn gegevens');
  });
});
