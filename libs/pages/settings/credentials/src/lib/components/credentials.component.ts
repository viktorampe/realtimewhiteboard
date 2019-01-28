import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PassportUserCredentialInterface } from '@campus/dal';
import { Observable } from 'rxjs';
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

  message$: Observable<string>;

  constructor(
    private viewModel: CredentialsViewModel,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getError();
  }

  getError() {
    //todo straighten errors with effectFeedback PR
    if (this.route.snapshot) {
      this.message$ = this.viewModel.getErrorMessageFromCode(
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
