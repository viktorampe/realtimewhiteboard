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
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    window.open(provider.linkUrl, '_self');
    // Dit lijkt me een ietwat omslachtige manier om een link te openen
    // Had de constructie in de huidige site een reden? En is die reden nu nog van toepassing?
  }

  public unlinkCredential(credential: PassportUserCredentialInterface): void {
    this.store.dispatch(new CredentialActions.UnlinkCredential({ credential }));
  }

  private setSourceStreams(): void {
    this.ssoFromEnvironment$ = new BehaviorSubject<EnvironmentSsoInterface>(
      this.environmentSso
    );
  }

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.credentials$ = combineLatest(
      this.ssoFromEnvironment$,
      this.store.pipe(select(CredentialQueries.getAll))
    ).pipe(
      map(([ssoEnv, credentials]) => {
        const editedCredentials: PassportUserCredentialInterface[] = [];
        for (let i = 0; i < credentials.length; i++) {
          editedCredentials.push({
            useAvatar: credentials[i].useAvatar,
            profile: credentials[i].profile,
            provider: credentials[i].provider,
            authScheme: credentials[i].authScheme,
            externalId: credentials[i].externalId,
            created: credentials[i].created,
            modified: credentials[i].modified,
            id: credentials[i].id,
            userId: credentials[i].userId,
            user: credentials[i].user,
            providerLogo: ssoEnv[credentials[i].provider].logoIcon
          });
        }
        return editedCredentials;
      })
    );

    this.singleSignOnProviders$ = combineLatest(
      this.ssoFromEnvironment$,
      this.credentials$
    ).pipe(
      map(([ssoEnv, credentials]) => {
        return this.convertToSingleSignOnProviders(ssoEnv).filter(
          provider =>
            credentials.filter(
              credential => credential.provider === provider.name
            ).length < provider.maxNumberAllowed
        );
      })
    );
  }

  private convertToSingleSignOnProviders(
    environment: EnvironmentSsoInterface
  ): SingleSignOnProviderInterface[] {
    return Object.keys(environment).reduce(
      (acc, key) => {
        const provider = environment[key];
        if (provider.enabled) {
          acc.push({
            name: key,
            ...provider,
            description: provider.description || 'Single Sign-On',
            maxNumberAllowed: provider.maxNumberAllowed || 1
          });
        }
        return acc;
      },
      [] as SingleSignOnProviderInterface[]
    );
  }
}

interface MappedObservables {
  credentials$: Observable<PassportUserCredentialInterface[]>;
  singleSignOnProviders$: Observable<SingleSignOnProviderInterface[]>;
}

export interface SingleSignOnProviderInterface {
  name: string;
  description: string;
  logoIcon?: string;
  className?: string;
  linkUrl: string;
  maxNumberAllowed?: number;
}
