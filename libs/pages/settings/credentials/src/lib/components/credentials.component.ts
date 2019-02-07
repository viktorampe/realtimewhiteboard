import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PassportUserCredentialInterface } from '@campus/dal';
import {
  CredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.viewmodel';

@Component({
  selector: 'campus-credentials-component',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
  credentials$ = this.viewModel.credentials$;
  ssoLinks$ = this.viewModel.singleSignOnProviders$;

  constructor(
    private viewModel: CredentialsViewModel,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getError();
  }

  getError() {
    if (this.route.snapshot) {
      this.viewModel.handleLinkError(
        this.route.snapshot.queryParamMap.get('error')
      );
    }
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
}
