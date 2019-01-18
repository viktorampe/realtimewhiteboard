import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { CredentialFixture } from '@campus/dal';
import { UiModule } from '@campus/ui';
import {
  CredentialErrors,
  CredentialsComponent
} from './credentials.component';
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
      imports: [MatIconModule, UiModule],
      declarations: [CredentialsComponent],
      providers: [
        {
          provide: CredentialsViewModel,
          useValue: MockCredentialsViewModel
        }
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

  it('should return correct url paramter', () => {
    expect(component.getParameterByName('error', '')).toBe(null);
    expect(component.getParameterByName('error', '?error=test')).toBe('test');
    expect(component.getParameterByName('error', '?error')).toBe('');
  });

  it('should return correct error message', () => {
    expect(component.getErrorMessage('error')).toBe('');
    expect(component.getErrorMessage(CredentialErrors.AlreadyLinked)).toBe(
      'Dit account werd al aan een ander profiel gekoppeld.'
    );
    expect(
      component.getErrorMessage(CredentialErrors.ForbiddenMixedRoles)
    ).toBe(
      'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.'
    );
    expect(
      component.getErrorMessage(CredentialErrors.ForbiddenInvalidRoles)
    ).toBe(
      'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.'
    );
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
