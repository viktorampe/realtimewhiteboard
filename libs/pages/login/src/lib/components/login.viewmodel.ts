import { Injectable } from '@angular/core';
import {
  DalState,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginViewModel {
  public currentUser$: Observable<PersonInterface>;
  public loginPresets = [
    { label: 'Student', username: 'student1', password: 'testje' },
    { label: 'Leerkracht', username: 'teacher1', password: 'testje' }
  ];

  constructor(private store: Store<DalState>) {
    this.setupStreams();
  }

  public login(username: string, password: string) {
    this.store.dispatch(new UserActions.LogInUser({ username, password }));
  }
  public logout() {
    this.store.dispatch(new UserActions.RemoveUser());
  }

  private setupStreams() {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
  }
}
