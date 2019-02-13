import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
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
        { provide: AppViewModel, useValue: {} },
        {
          provide: FAVICON_SERVICE_TOKEN,
          useClass: FavIconService
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
