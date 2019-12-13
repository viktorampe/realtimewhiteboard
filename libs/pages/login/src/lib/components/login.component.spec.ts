import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { LoginComponent } from './login.component';
import { LoginViewModel } from './login.viewmodel';
import { MockLoginViewModel } from './login.viewmodel.mock';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let viewmodel: MockLoginViewModel;
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
    viewmodel = TestBed.get(LoginViewModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call clearError on keydown', () => {
    jest.spyOn(component, 'clearError');
    viewmodel.currentUser$.next(null);
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      shiftKey: false
    });

    const inputFields = fixture.debugElement.queryAll(By.css('input'));

    inputFields.forEach(field => {
      const inputElement = field.nativeElement;
      inputElement.dispatchEvent(event);
    });

    expect(component.clearError).toHaveBeenCalledTimes(2);
  });
});
