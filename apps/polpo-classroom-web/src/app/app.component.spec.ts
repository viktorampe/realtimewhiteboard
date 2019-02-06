import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppViewModel } from './app.viewmodel';
import {
  BrowserFaviconService,
  BrowserFaviconToken
} from './services/favicons';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AppViewModel, useValue: {} },
        {
          provide: Title,
          useClass: Title
        },
        {
          provide: BrowserFaviconToken,
          useClass: BrowserFaviconService
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
