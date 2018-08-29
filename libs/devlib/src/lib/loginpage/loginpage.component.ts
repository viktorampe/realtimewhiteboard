import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  loginWithToken(token: string) {}

  login(name: string, password: string) {}
}
