import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@campus/dal';
import { take } from 'rxjs/operators';

@Component({
  selector: 'campus-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.goToWhiteboard();
    }
  }

  login(username?: string, password?: string) {
    username = 'piet';
    password = 'testje';
    this.authService
      .login({ username, password })
      .pipe(take(1))
      .subscribe(response => {
        if (response.userId) this.goToWhiteboard();
      });
  }

  logout() {
    this.authService.logout();
  }

  private goToWhiteboard() {
    this.router.navigate(['whiteboard']);
  }
}
