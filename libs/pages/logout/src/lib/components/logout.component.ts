import { Component, OnInit } from '@angular/core';
import { LogoutViewModel } from './logout.viewmodel';

@Component({
  selector: 'campus-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(private logoutViewModel: LogoutViewModel) {}

  ngOnInit() {
    this.logoutViewModel.logout();
  }
}
