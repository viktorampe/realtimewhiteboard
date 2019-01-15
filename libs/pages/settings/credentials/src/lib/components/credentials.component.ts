import { Component, Inject, OnInit } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { PassportUserCredentialInterface } from '@campus/dal';
import { Observable } from 'rxjs';

export enum CredentialErrors {
  ForbiddenMixedRoles = 'ForbiddenError: mixed_roles',
  ForbiddenInvalidRoles = 'ForbiddenError: invalid_roles',
  AlreadyLinked = 'Error: Credentials already linked'
}

export enum ConnectionType {
  Facebook = 'facebook',
  Smartschool = 'smartschool',
  Google = 'google'
}

export interface SsoLink {
  name: string;
  connectionType: ConnectionType;
  icon: string;
}

@Component({
  selector: 'campus-credentials-component',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
  connectionTypes = ConnectionType;

  crednetials$: Observable<PassportUserCredentialInterface[]>;
  ssoLinks$: Observable<SingleSignOnProviderInterface[]>;

  message = '';

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit() {
    const error = this.getParameterByName('error');
    this.message = this.getErrorMessage(error);
    const messageStatus = 'alert-danger';
  }

  getErrorMessage(error: string): string {
    if (error) {
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

  connect(connectionType: ConnectionType) {}
  addCredential(provider) {
    /*window.location.href =
      polpo.AuthBase +
      '/' +
      provider +
      '-link/' +
      encodeURIComponent(polpo.StudentBase + '/#/profile/sso') +
      '?type=student&access_token=' +
      LoopBackAuth.accessTokenId;*/
  }

  decoupleCredential(credential) {
    /*Person.credentials
      .destroyById({ id: vm.user.id, fk: credential.id })
      .$promise.then(function() {
        var i = vm.credentials.indexOf(credential);
        if (i !== -1) {
          vm.credentials.splice(i, 1);
        }
      })
      .catch(function(err) {
        console.error(err);
      });*/
  }

  getClass(provider: string) {
    return 'fa fa-' + provider.replace('-link', '');
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

  changeAvatar(credential) {
    /*Person.useAvatarFromCredential({id:vm.user.id, credential: credential.id}).$promise.then(function(result){
      if(result.message === 'succeeded'){
          Person.getCurrentUser(true).then(function(result){
              vm.user = result;
          });
      } else {
          console.error(result);
      }
  }).catch(function(err){
      console.error(err);
  });*/
  }
}
