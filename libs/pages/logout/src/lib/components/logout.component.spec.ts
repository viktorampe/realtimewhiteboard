import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StateFeatureBuilder, UserReducer } from '@campus/dal';
import {
  EnvironmentLogoutInterface,
  ENVIRONMENT_LOGOUT_TOKEN
} from '@campus/shared';
import { StoreModule } from '@ngrx/store';
import { LogoutComponent } from './logout.component';
import { LogoutViewModel } from './logout.viewmodel';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([UserReducer])
      ],
      providers: [
        LogoutViewModel,
        {
          provide: ENVIRONMENT_LOGOUT_TOKEN,
          useValue: <EnvironmentLogoutInterface>{ url: '' }
        }
      ],
      declarations: [LogoutComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
