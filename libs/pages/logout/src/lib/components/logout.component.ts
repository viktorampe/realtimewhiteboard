import { Component } from '@angular/core';
import { LogoutViewModel } from './logout.viewmodel';

@Component({
  selector: 'campus-logout-component',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private logoutViewModel: LogoutViewModel) {}

  //TODO add code
}
