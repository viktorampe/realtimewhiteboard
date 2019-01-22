import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private viewModel: CredentialsViewModel,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const error = this.route.snapshot.queryParamMap.get('error');
    this.message$ = this.getErrorTypeMessage(error);
  }

  getErrorTypeMessage(error: string): Observable<string> {
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
    const ob = {
      displayName: '',
      name: '',
      firstName: '',
      avatar: ''
    };
    if (credential.profile && credential.profile.name) {
      ob.displayName = credential.profile.name.displayName;
      ob.name = credential.profile.name.familyName;
      ob.firstName = credential.profile.name.givenName;
      ob.avatar = credential.profile.avatar;
    }
    return ob;
  }
}
