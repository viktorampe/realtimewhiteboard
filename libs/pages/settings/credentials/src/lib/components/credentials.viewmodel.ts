import { Injectable } from '@angular/core';
import {
  DalState,
  PassportUserCredentialInterface,
  PersonInterface,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MockCredentialsViewModel } from './credentials.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class CredentialsViewModel {
  public currentUser$: Observable<PersonInterface>;

  // code uit huidige site voor profile picture
  // img ng-if="::credential.provider === 'google' || credential.provider === 'facebook'" dk-src="{{::credential.profile.photos[0].value}}" src="/img/avatar.png" width="45" height="45">
  // <img ng-if="::credential.provider === 'smartschool'" dk-src="{{::credential.profile.avatar}}" src="/img/avatar.png" width="45" height="45">
  // TODO: write getter? add photolocation to environment file? map in stream?
  public credentials$: Observable<PassportUserCredentialInterface[]>;
  public singleSignOnProviders$: Observable<SingleSignOnProviderInterface[]>;

  constructor(
    private store: Store<DalState>,
    private mockViewModel: MockCredentialsViewModel
  ) {
    this.setPresentationStreams();
  }

  public useProfilePicture(credential: PassportUserCredentialInterface): void {}

  public linkCredential(userId: number, providerId: number): void {}

  public unlinkCredential(credential: PassportUserCredentialInterface): void {}

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.credentials$ = this.mockViewModel.credentials$;
    this.singleSignOnProviders$ = this.mockViewModel.singleSignOnProviders$;
  }
}

export interface SingleSignOnProviderInterface {
  providerId: number;
  description: string;
  logoSrc?: string; // beter als css-class? om dan met mat-icon te gebruiken?
  layoutClass?: string; //css style toe te voegen aan styles.css ? //beter met inline style?
}
