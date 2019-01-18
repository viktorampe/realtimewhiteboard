import { Component, OnInit } from '@angular/core';
import { PersonInterface } from '@campus/dal';
import { ProfileViewModel } from '../profile.viewmodel';

@Component({
  selector: 'campus-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pageTitle = 'Mijn gegevens';
  pageIcon = ''; // TODO: add icon
  user$ = this.viewModel.currentUser$;
  constructor(private viewModel: ProfileViewModel) {}

  ngOnInit() {}

  onSaveProfile(changes: Partial<PersonInterface>) {
    this.viewModel.updateProfile(changes);
  }
}
