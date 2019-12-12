import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PersonInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { LoginViewModel } from './login.viewmodel';
DeviceMotionEvent;
@Component({
  selector: 'pages-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public currentUser$: Observable<PersonInterface>;
  public loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  public loginPresets = this.loginViewModel.loginPresets;

  @HostBinding('class.pages-login') isCampusLogin = true;
  @HostBinding('class.campus-page') isCampusPage = true;

  constructor(private loginViewModel: LoginViewModel) {}

  ngOnInit(): void {
    this.currentUser$ = this.loginViewModel.currentUser$;
  }

  public login(username: string, password: string) {
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
}
