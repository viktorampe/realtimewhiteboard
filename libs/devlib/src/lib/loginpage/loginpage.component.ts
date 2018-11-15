import { Component, OnInit } from '@angular/core';
import { AlertReducer, EduContentInterface, UserActions } from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoginPageViewModel } from './loginpage.viewmodel';

@Component({
  selector: 'campus-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  educontents: Observable<EduContentInterface[]>;
  currentUser: Observable<any>;
  constructor(
    public loginPageviewModel: LoginPageViewModel,
    private personApi: PersonApi,
    private store: Store<AlertReducer.State>
  ) {}

  ngOnInit() {}

  getCurrentUser() {
    this.currentUser = this.personApi.getCurrent();
  }

  loadCurrentUserinState() {
    this.store.dispatch(new UserActions.LoadUser({ force: true }));
  }
}
