import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { ButtonComponent, UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { LoginComponent } from './login.component';
import { LoginViewModel } from './login.viewmodel';
import { MockLoginViewModel } from './login.viewmodel.mock';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let viewmodel: MockLoginViewModel;
  let fixture: ComponentFixture<LoginComponent>;
  let loginViewModel: LoginViewModel;
  let router: Router;
  let currentUser$: BehaviorSubject<PersonInterface>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: LoginViewModel, useClass: MockLoginViewModel },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    viewmodel = TestBed.get(LoginViewModel);
    component = fixture.componentInstance;
    loginViewModel = TestBed.get(LoginViewModel);
    router = TestBed.get(Router);
    fixture.detectChanges();

    currentUser$ = loginViewModel.currentUser$ as BehaviorSubject<
      PersonInterface
    >;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    describe('logged in', () => {
      const person = new PersonFixture();

      beforeEach(() => {
        currentUser$.next(person);
        fixture.detectChanges();
      });

      it('should show the current user name', () => {
        const formTitleDE = fixture.debugElement.query(
          By.css('.pages-login__form__title')
        );

        expect(formTitleDE.nativeElement.textContent.trim()).toBe(
          'Je bent ingelogd als ' + person.displayName
        );
      });

      it('should show a log out button', () => {
        const buttonDE = fixture.debugElement.query(
          By.directive(ButtonComponent)
        );

        expect(buttonDE.nativeElement.textContent.trim()).toBe('Afmelden');
      });
    });

    describe('not logged in', () => {
      beforeEach(() => {
        currentUser$.next(undefined);
        fixture.detectChanges();
      });

      it('should show the login form', () => {
        const formTitleDE = fixture.debugElement.query(
          By.css('.pages-login__form__title')
        );

        expect(formTitleDE.nativeElement.textContent.trim()).toBe(
          'Vul uw gebruikersgegevens in'
        );
      });

      it('should show a log in button', () => {
        const buttonDE = fixture.debugElement.query(
          By.directive(ButtonComponent)
        );

        expect(buttonDE.nativeElement.textContent.trim()).toBe('Aanmelden');
      });

      it('should show the login presets', () => {
        const loginPresets = loginViewModel.loginPresets;

        const buttonDEs = fixture.debugElement.queryAll(
          By.directive(ButtonComponent)
        );

        // first button is log in button
        const loginPresetButtonDEs = buttonDEs.slice(1);

        loginPresets.forEach((preset, index) => {
          expect(
            loginPresetButtonDEs[index].nativeElement.textContent.trim()
          ).toBe(preset.label);
        });
      });
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

  describe('logging in', () => {
    beforeEach(() => {
      currentUser$.next(undefined);
      fixture.detectChanges();
    });
    it('should redirect after a succesful login', () => {
      router.navigate = jest.fn();

      component.login('foo', 'bar');
      expect(router.navigate).not.toHaveBeenCalled();

      currentUser$.next(new PersonFixture());
      expect(router.navigate).toHaveBeenCalled();

      fixture.detectChanges();
      const redirectDE = fixture.debugElement.query(
        By.css('.pages-login__form--redirecting')
      );
      expect(redirectDE.nativeElement.textContent.trim()).toContain(
        'Even geduld, u wordt doorverwezen'
      );
    });
  });
});
