import { Component, Inject, OnInit } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { Observable, of } from 'rxjs';

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

  crednetials$: Observable<string[]> = of([
    'test',
    'test2',
    'test3',
    'test4',
    'test5',
    'test6',
    'test7'
  ]);
  ssoLinks$: Observable<SsoLink[]> = of([
    {
      name: 'Smartschool',
      connectionType: ConnectionType.Smartschool,
      icon: ''
    },
    {
      name: 'Facebook',
      connectionType: ConnectionType.Facebook,
      icon: ''
    },
    {
      name: 'Google',
      connectionType: ConnectionType.Google,
      icon: ''
    }
  ]);

  message = '';

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit() {
    const error = this.getParameterByName('error');
    this.message = this.getErrorMessage(error);
    const messageStatus = 'alert-danger';
  }

  connect(connectionType: ConnectionType) {
    //todo
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
    console.log(results[0]);
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
