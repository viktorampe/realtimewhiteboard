import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EffectFeedbackInterface, PersonInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { filter, map, skip, take } from 'rxjs/operators';
import { LoginViewModel } from './login.viewmodel';

@Component({
  selector: 'campus-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public currentUser$: Observable<PersonInterface>;
  public errorFeedback$: Observable<EffectFeedbackInterface>;
  public hasError$: Observable<boolean>;

  public loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  public loginPresets = this.loginViewModel.loginPresets;

  public redirecting = false;

  @HostBinding('class.pages-login') isCampusLogin = true;
  @HostBinding('class.campus-page') isCampusPage = true;

  constructor(private loginViewModel: LoginViewModel, private router: Router) {}

  ngOnInit(): void {
    this.currentUser$ = this.loginViewModel.currentUser$;
    this.errorFeedback$ = this.loginViewModel.errorFeedback$;
    this.hasError$ = this.errorFeedback$.pipe(map(error => !!error));
  }

  public clearError() {
    this.loginViewModel.clearError();
  }
  public login(username: string, password: string) {
    this.redirectAfterLogin();
    this.loginViewModel.login(username, password);
  }
  public logout() {
    this.loginViewModel.logout();
  }

  public submit() {
    if (this.loginForm.valid) {
      this.login(
        this.loginForm.get('username').value,
        this.loginForm.get('password').value
      );
    }
  }

  private redirectAfterLogin(route = ['']) {
    this.currentUser$
      .pipe(
        skip(1), // skip value before login
        take(1), // complete after 1 login
        filter(user => !!user) // only redirect when login is succesful
      )
      .subscribe(() => {
        this.router.navigate(route);
        this.redirecting = true;
      });
  }
}
