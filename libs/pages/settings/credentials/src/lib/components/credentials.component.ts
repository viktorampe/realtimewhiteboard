import { Component, Injectable, OnInit } from '@angular/core';
import { PassportUserCredentialInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import {
  CredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.viewmodel';

export enum CredentialErrors {
  ForbiddenMixedRoles = 'ForbiddenError: mixed_roles',
  ForbiddenInvalidRoles = 'ForbiddenError: invalid_roles',
  AlreadyLinked = 'Error: Credentials already linked'
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
  ssoLinks$ = this.viewModel.singleSignOnProviders$;

  message = '';

  constructor(private viewModel: CredentialsViewModel) {}

  ngOnInit() {
    const error = this.getParameterByName('error');
    this.message = this.getErrorMessage(error);
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

  getIconForProvider(
    credential: PassportUserCredentialInterface
  ): Observable<string> {
    return this.viewModel.getProviderLogoFromCredential(credential);
  }
}
