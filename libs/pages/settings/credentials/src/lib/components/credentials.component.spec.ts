import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CredentialFixture } from '@campus/dal';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockActivatedRoute, MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { CredentialsComponent } from './credentials.component';
import {
  CredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.viewmodel';
import { MockCredentialsViewModel } from './credentials.viewmodel.mock';

@NgModule({
  exports: [CredentialsComponent]
})
export class TestModule {}

describe('CredentialsComponent', () => {
  let component: CredentialsComponent;
  let fixture: ComponentFixture<CredentialsComponent>;
  let cred1: CredentialFixture;
  let viewmodel: CredentialsViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, UiModule, SharedModule],
      declarations: [CredentialsComponent],
      providers: [
        {
          provide: CredentialsViewModel,
          useClass: MockCredentialsViewModel
        },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    viewmodel = TestBed.get(CredentialsViewModel);
  }));

  beforeEach(() => {
    cred1 = new CredentialFixture();
    fixture = TestBed.createComponent(CredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call viewmodel when adding credential', () => {
    const sso: SingleSignOnProviderInterface = {
      name: '',
      description: '',
      logoIcon: '',
      linkUrl: '',
      maxNumberAllowed: 0
    };
    jest.spyOn(viewmodel, 'linkCredential');
    component.addCredential(sso);
    fixture.detectChanges();
    expect(viewmodel.linkCredential).toHaveBeenCalledWith(sso);
  });

  it('should call viewmodel when removing credential', () => {
    jest.spyOn(viewmodel, 'unlinkCredential');
    component.decoupleCredential(cred1);
    fixture.detectChanges();
    expect(viewmodel.unlinkCredential).toHaveBeenCalledWith(cred1);
  });
  it('should call viewmodel when setting avatar', () => {
    jest.spyOn(viewmodel, 'useProfilePicture');
    component.changeAvatar(cred1);
    fixture.detectChanges();
    expect(viewmodel.useProfilePicture).toHaveBeenCalledWith(cred1);
  });
});
