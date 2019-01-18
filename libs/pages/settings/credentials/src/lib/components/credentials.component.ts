import { Component, Injectable, OnInit } from '@angular/core';
import { PassportUserCredentialInterface } from '@campus/dal';
import { Observable } from 'rxjs';

export enum CredentialErrors {
  ForbiddenMixedRoles = 'ForbiddenError: mixed_roles',
  ForbiddenInvalidRoles = 'ForbiddenError: invalid_roles',
  AlreadyLinked = 'Error: Credentials already linked'
}

export interface SingleSignOnProviderInterface {
  providerId: number;
  name: string;
  description: string;
  logoSrc?: string;
  layoutClass?: string;
  url: string;
  maxNumberAllowed?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockCredentialsViewModel {
  ssoLinks$: Observable<SingleSignOnProviderInterface[]>;
  credentials$: Observable<PassportUserCredentialInterface[]>;
  linkCredential(credential: SingleSignOnProviderInterface): void {}
  unlinkCredential(credential: PassportUserCredentialInterface): void {}
  useProfilePicture(credential: PassportUserCredentialInterface): void {}
}

@Component({
  selector: 'campus-credentials-component',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
  credentials$ = this.viewModel.credentials$;
  ssoLinks$ = this.viewModel.ssoLinks$;

  message = '';

  constructor(private viewModel: MockCredentialsViewModel) {}

  ngOnInit() {
    const error = this.getParameterByName('error');
    this.message = this.getErrorMessage(error);
    const messageStatus = 'alert-danger';
  }

  getErrorMessage(error: string): string {
    switch (error) {
      case CredentialErrors.ForbiddenMixedRoles:
      case CredentialErrors.ForbiddenInvalidRoles:
        return 'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.';
      case CredentialErrors.AlreadyLinked:
        return 'Dit account werd al aan een ander profiel gekoppeld.';
    }
    return '';
      if (
        error === CredentialErrors.ForbiddenMixedRoles ||
        error === CredentialErrors.ForbiddenInvalidRoles
      ) {
        return 'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.';
      }
      if (error === CredentialErrors.AlreadyLinked) {
        return 'Dit account werd al aan een ander profiel gekoppeld.';
      }
    }
    return '';
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

  getUserNameToDisplayByCredential(
    credential: PassportUserCredentialInterface
  ): string {
    if (
      credential.provider === 'facebook' ||
      credential.provider === 'smartschool'
    ) {
      return (
        credential.profile.name.givenName +
        ' ' +
        credential.profile.name.familyName
      );
    } else if (credential.provider === 'google') {
      return credential.profile.displayName;
    }
    return '';
  }

  getIconForProvider(provider: string) {
    if (provider === 'facebook') {
      return 'facebook';
    } else if (provider === 'google') {
      return 'google';
    } else if (provider === 'smartschool') {
      return 'smartschool:orange';
    }
    return '';
  }

  getDate(timestamp: string) {
    const d = Date.parse(timestamp);
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(d).toLocaleDateString('nl-BE', options);
  }

  getTime(timestamp: string) {
    const d = Date.parse(timestamp);
    return new Date(d).toLocaleTimeString('nl-BE');
  }
}
