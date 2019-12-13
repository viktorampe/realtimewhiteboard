import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { LoginComponent } from './login.component';
import { LoginViewModel } from './login.viewmodel';
import { MockLoginViewModel } from './login.viewmodel.mock';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule
      ],
      declarations: [LoginComponent],
      providers: [{ provide: LoginViewModel, useClass: MockLoginViewModel }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
