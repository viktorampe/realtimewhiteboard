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
  // TODO: add photolocation to environment file?
  public credentials$: Observable<PassportUserCredentialInterface[]>;
  public singleSignOnProviders$: Observable<SingleSignOnProviderInterface[]>;

  constructor(
    private store: Store<DalState>,
    private mockViewModel: MockCredentialsViewModel
  ) {
    this.setPresentationStreams();
  }

  public useProfilePicture(credential: PassportUserCredentialInterface): void {
    // this.store.dispatch(
    //   UserActions.UseCredentialProfilePicture({ credential })
    // );
  }

  public linkCredential(providerId: number): void {
    // code in current site
    /*
      function addCredential(provider){
          window.location.href = polpo.AuthBase+'/'+provider+'-link/'+
              encodeURIComponent(polpo.StudentBase + '/#/profile/sso') +
              '?type=student&access_token=' + LoopBackAuth.accessTokenId;
      }
    */
  }

  public unlinkCredential(credential: PassportUserCredentialInterface): void {
    // this.store.dispatch(UserActions.UnlinkCredential({ credential }));
  }

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    // this.credentials$ = this.store.pipe(select(CredentialQueries.getAll));
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
