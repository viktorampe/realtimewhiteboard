import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@campus/ui';
import { HeaderComponent } from './header.component';
import { HeaderViewModel } from './header.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockHeaderViewModel {
  enableAlerts: true;
  enableMessages: true;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [HeaderComponent],
      providers: [
        {
          provide: HeaderViewModel,
          useClass: MockHeaderViewModel
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
});
