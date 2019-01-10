import { Injectable } from '@angular/core';
import {
  DalState,
  PassportUserCredentialInterface,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Url } from 'url';
import { MockCredentialsViewModel } from './credentials.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class CredentialsViewModel {
  public currentUser$: Observable<PersonInterface>;
  public credentials$: Observable<PassportUserCredentialInterface[]>;
  public singleSignOnLinks$: Observable<Url[]>; //TODO is this the correct type?

  constructor(
    private store: Store<DalState>,
    private mockViewModel: MockCredentialsViewModel
  ) {
    this.setPresentationStreams();
  }

  public updateProfile(
    userId: number,
    changedProps: Partial<PersonInterface>
  ): void {
    this.store.dispatch(new UserActions.UpdateUser({ userId, changedProps }));
  }

  public unlinkCredential(userId: number, credentialId: number): void {}

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.credentials$ = this.mockViewModel.credentials$;
    this.singleSignOnLinks$ = this.mockViewModel.singleSignOnLinks$;
  }
}
