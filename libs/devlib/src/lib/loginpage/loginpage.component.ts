import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@campus/dal';

@Component({
  selector: 'campus-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  name: string;
  password: string;
  response: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login(name: string, password: string) {
    this.authService.login({ username: name, password: password }).subscribe(
      ok => {
        this.router.navigate(['/']);
        //todo save user to store.
      },
      error => {
        this.response = error.message;
      }
    );
  }
}
