import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import {
  EnvironmentFeaturesInterface,
  ENVIRONMENT_FEATURES_TOKEN
} from '../interfaces';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const environmentFeatures: EnvironmentFeaturesInterface = {
    alerts: {
      enabled: true,
      hasAppBarDropDown: true
    },
    messages: {
      enabled: false,
      hasAppBarDropDown: false
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [HeaderComponent],
      providers: [
        { provide: ENVIRONMENT_FEATURES_TOKEN, useValue: environmentFeatures }
      ]
    }).compileComponents();
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
    it('should show the feature components if false', () => {
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
});
