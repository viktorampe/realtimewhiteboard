import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { WINDOW } from '@campus/browser';
import { UiModule } from '@campus/ui';
import { AppComponent } from './app.component';
import { AppViewModel } from './app.viewmodel';
import { FavIconService, FAVICON_SERVICE_TOKEN } from './services/favicons';

@Component({
  selector: 'campus-header',
  template: '<div>this is the header</div>'
})
class CampusHeaderTestComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, NoopAnimationsModule],
      declarations: [AppComponent, CampusHeaderTestComponent],
      schemas: [],
      providers: [
        {
          provide: AppViewModel,
          useValue: {
            toggleSidebar: () => {}
          }
        },
        {
          provide: FAVICON_SERVICE_TOKEN,
          useClass: FavIconService
        },
        {
          provide: WINDOW,
          useValue: {
            location: {
              search: ''
            }
          }
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should not have a shell when useShell is 0', async(() => {
    const window = TestBed.get(WINDOW);
    window.location.search = '?useShell=0';
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('campus-shell'))).toBeFalsy();
  }));

  it('should have a shell when useShell is 1', async(() => {
    const window = TestBed.get(WINDOW);
    window.location.search = '?useShell=1';
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('campus-shell'))).toBeTruthy();
  }));
  it('should default have shell', async(() => {
    const window = TestBed.get(WINDOW);
    window.location.search = '?whatever';
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('campus-shell'))).toBeTruthy();
  }));
});
