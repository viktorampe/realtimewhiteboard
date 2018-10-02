import { Component, OnInit } from '@angular/core';
import { LoginPageViewModel } from './loginpage.viewmodel';

@Component({
  selector: 'campus-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  constructor(private loginPageviewModel: LoginPageViewModel) {
    console.log(loginPageviewModel);
  }

  ngOnInit() {}
}
