import { Inject, Injectable } from '@angular/core';
import {
  CredentialActions,
  CredentialQueries,
  DalState,
  EffectFeedback,
  EffectFeedbackActions,
  PassportUserCredentialInterface,
  PersonInterface,
  Priority,
  UserQueries
} from '@campus/dal';
import { EnvironmentSsoInterface, ENVIRONMENT_SSO_TOKEN } from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export enum CredentialErrors {
  ForbiddenMixedRoles = 'ForbiddenError: mixed_roles',
  ForbiddenInvalidRoles = 'ForbiddenError: invalid_roles',
  AlreadyLinked = 'Error: Credentials already linked'
}

@Injectable({
  providedIn: 'root'
})
export class CredentialsViewModel {
  public currentUser$: Observable<PersonInterface>;
  public credentials$: Observable<CredentialWithProviderLogoInterface[]>;
  public singleSignOnProviders$: Observable<SingleSignOnProviderInterface[]>;
  private ssoFromEnvironment$: Observable<EnvironmentSsoInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_SSO_TOKEN)
    private environmentSso: EnvironmentSsoInterface,
    @Inject('uuid') private uuid: Function
  ) {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  public handleLinkError(code: string): void {
    const message$ = this.getErrorMessageFromCode(code);
    message$.pipe(take(1)).subscribe(message =>
      this.store.dispatch(
        new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: this.uuid(),
            triggerAction: null,
            message: message,
            type: 'error',
            priority: Priority.HIGH
          })
        })
      )
    );
  }

  private getErrorMessageFromCode(code: string): Observable<string> {
    return this.currentUser$.pipe(
      map(user => {
        let userTypeString = 'Smartschool-LEERKRACHT';
        if (user.type && user.type === 'student') {
          userTypeString = 'Smartschool-LEERLING';
        }
        switch (code) {
          case CredentialErrors.ForbiddenMixedRoles:
          case CredentialErrors.ForbiddenInvalidRoles:
            return (
              'Je kan enkel een ' +
              userTypeString +
              ' profiel koppelen aan dit POLPO-profiel.'
            );
          case CredentialErrors.AlreadyLinked:
            return 'Dit account werd al aan een ander profiel gekoppeld.';
        }
        return '';
      })
    );
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
    this.credentials$ = combineLatest([
      this.ssoFromEnvironment$,
      this.store.pipe(select(CredentialQueries.getAll))
    ]).pipe(
      map(([ssoEnv, credentials]) => {
        return credentials.map(cred => ({
          ...cred,
          providerLogo: ssoEnv[cred.provider].logoIcon
        }));
      })
    );

    this.singleSignOnProviders$ = combineLatest([
      this.ssoFromEnvironment$,
      this.credentials$]
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
            className: key + '-btn',
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

export interface SingleSignOnProviderInterface {
  name: string;
  description: string;
  logoIcon?: string;
  className?: string;
  linkUrl: string;
  maxNumberAllowed?: number;
}

export interface CredentialWithProviderLogoInterface
  extends PassportUserCredentialInterface {
  providerLogo?: string;
}
