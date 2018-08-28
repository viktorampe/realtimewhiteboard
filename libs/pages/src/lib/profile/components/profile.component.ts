import { Component } from '@angular/core';
import { ProfileViewModel } from './profile.viewmodel';

@Component({
  selector: 'campus-profile-component',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(private profileViewModel: ProfileViewModel) {}

  //TODO add code
}
