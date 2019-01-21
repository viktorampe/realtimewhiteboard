import { Component, OnInit } from '@angular/core';
import { PassportUserCredentialInterface } from '@campus/dal';
import { BadgePersonInterface } from '@campus/ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.viewmodel';

export enum CredentialErrors {
  ForbiddenMixedRoles = 'ForbiddenError: mixed_roles',
  ForbiddenInvalidRoles = 'ForbiddenError: invalid_roles',
  AlreadyLinked = 'Error: Credentials already linked'
}

@Component({
  selector: 'campus-credentials-component',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
  credentials$ = this.viewModel.credentials$;
  ssoLinks$ = this.viewModel.singleSignOnProviders$;
  currentUser$ = this.viewModel.currentUser$;

  message$: Observable<string>;

  constructor(private viewModel: CredentialsViewModel) {
    this.credentials$ = this.viewModel.credentials$;
    this.ssoLinks$ = this.viewModel.singleSignOnProviders$;
  }

  ngOnInit() {
    const error = this.getParameterByName('error');
    this.message$ = this.getErrorMessage(error);
  }

  getErrorMessage(error: string): Observable<string> {
    return this.currentUser$.pipe(
      map(user => {
        let userTypeString = 'Smartschool-LEERKRACHT';
        if (user.type && user.type === 'student') {
          userTypeString = 'Smartschool-LEERLING';
        }
        switch (error) {
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

  getParameterByName(name: string, url?: string): string {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  decoupleCredential(credential: PassportUserCredentialInterface) {
    this.viewModel.unlinkCredential(credential);
  }

  changeAvatar(credential: PassportUserCredentialInterface) {
    this.viewModel.useProfilePicture(credential);
  }

  addCredential(credential: SingleSignOnProviderInterface) {
    this.viewModel.linkCredential(credential);
  }

  getPersonForBadge(
    credential: PassportUserCredentialInterface
  ): BadgePersonInterface {
    console.log(credential);
    return {
      displayName: credential.profile.displayName,
      name: credential.profile.name.familyName,
      firstName: credential.profile.givenName,
      avatar: credential.profile.avatar
    };
  }
}
