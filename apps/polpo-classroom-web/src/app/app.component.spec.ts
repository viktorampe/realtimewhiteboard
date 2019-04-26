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
            toggleSidebar: () => {},
            toggleSidebarOnNavigation: () => {}
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
    });
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should not have a shell when useShell is 0', async(() => {
    testForShell('?useShell=0', false);
  }));

  it('should have a shell when useShell is 1', async(() => {
    testForShell('?useShell=1', true);
  }));
  it('should default have shell', async(() => {
    testForShell('?whatever', true);
  }));
});

function testForShell(search, expected) {
  const window = TestBed.get(WINDOW);
  window.location.search = search;
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  const elem = fixture.debugElement.query(By.css('campus-shell'));
  if (expected) {
    expect(elem).toBeTruthy();
  } else {
    expect(elem).toBeFalsy();
  }
}
