import { Inject, Injectable } from '@angular/core';
import {
  CredentialActions,
  CredentialQueries,
  DalState,
  PassportUserCredentialInterface,
  PersonInterface,
  UserQueries
} from '@campus/dal';
import { EnvironmentSsoInterface, ENVIRONMENT_SSO_TOKEN } from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CredentialsViewModel {
  public currentUser$: Observable<PersonInterface>;
  public credentials$: Observable<PassportUserCredentialInterface[]>;
  public singleSignOnProviders$: Observable<SingleSignOnProviderInterface[]>;
  private ssoFromEnvironment$: Observable<EnvironmentSsoInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_SSO_TOKEN)
    private environmentSso: EnvironmentSsoInterface
  ) {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  public useProfilePicture(credential: PassportUserCredentialInterface): void {
    this.store.dispatch(
      new CredentialActions.UseCredentialProfilePicture({ credential })
    );
  }

  public linkCredential(provider: SingleSignOnProviderInterface): void {
    // code in current site
    /*
      function addCredential(provider){
          window.location.href = polpo.AuthBase+'/'+provider+'-link/'+
              encodeURIComponent(polpo.StudentBase + '/#/profile/sso') +
              '?type=student&access_token=' + LoopBackAuth.accessTokenId;
      }
    */
    window.open(provider.url, '_self');
    // Dit lijkt me een ietwat omslachtige manier om een link te openen
    // Had de constructie in de huidige site een reden? En is die reden nu nog van toepassing?
  }

  public unlinkCredential(credential: PassportUserCredentialInterface): void {
    this.store.dispatch(new CredentialActions.UnlinkCredential({ credential }));
  }

  private setSourceStreams(): void {
    // this.ssoFromEnvironment$ = new BehaviorSubject<
    //   SingleSignOnProviderInterface[]
    // >(this.environment.sso);
    this.ssoFromEnvironment$ = this.mockViewModel.singleSignOnProviders$;
  }

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.credentials$ = this.store.pipe(select(CredentialQueries.getAll));
    this.singleSignOnProviders$ = this.ssoFromEnvironment$.pipe(
      withLatestFrom(this.credentials$),
      map(([sso, credentials]) =>
        sso.filter(
          provider =>
            credentials.filter(
              credential => credential.provider === provider.name
            ).length <
            (provider.maxNumberAllowed ? provider.maxNumberAllowed : 1)
        )
      )
    );
  }
}

export interface SingleSignOnProviderInterface {
  providerId: number;
  name: string;
  description: string;
  logoSrc?: string; // beter als css-class? om dan met mat-icon te gebruiken?
  layoutClass?: string; //css style toe te voegen aan styles.css ? //beter met inline style?
  url: string;
  maxNumberAllowed?: number;
}
