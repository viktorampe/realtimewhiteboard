import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import {
  CredentialErrors,
  CredentialsComponent,
  MockCredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.component';

@NgModule({
  exports: [CredentialsComponent]
})
export class TestModule {}

describe('CredentialsComponent', () => {
  let component: CredentialsComponent;
  let fixture: ComponentFixture<CredentialsComponent>;
  let cred1;
  const viewmodel = new MockCredentialsViewModel();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [CredentialsComponent],
      providers: [
        {
          provide: MockCredentialsViewModel,
          useValue: viewmodel
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    cred1 = {
      provider: 'facebook',
      profile: {
        platform: 'smartschool',
        profileUrl: 'facebook',
        _json: {
          url: 'google'
        },
        displayName: 'google',
        name: {
          givenName: 'given',
          familyName: 'family'
        }
      }
    };
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

  it('should return correct displaynames', () => {
    cred1.provider = 'facebook';
    expect(component.getUserNameToDisplayByCredential(cred1)).toBe(
      'given family'
    );
    cred1.provider = 'google';
    expect(component.getUserNameToDisplayByCredential(cred1)).toBe('google');
    cred1.provider = 'smartschool';
    expect(component.getUserNameToDisplayByCredential(cred1)).toBe(
      'given family'
    );
    cred1.provider = '';
    expect(component.getUserNameToDisplayByCredential(cred1)).toBe('');
  });

  it('should return correct date string', () => {
    expect(component.getDate('any non valid timestamp')).toBe('Invalid Date');
    expect(component.getDate('01 Jan 1970 00:00:00 GMT')).toBe(
      '1970 M01 1, Thu'
    );
  });

  it('should return the correct time string', () => {
    console.log(component.getTime(''));
    expect(component.getTime('')).toBe('Invalid Date');
    expect(component.getTime('01 Jan 1970 00:00:00 GMT')).toBe('01:00:00');
  });

  it('should return correct profile link', () => {
    cred1.provider = 'facebook';
    expect(component.getPlatformLink(cred1)).toBe('facebook');
    cred1.provider = 'google';
    expect(component.getPlatformLink(cred1)).toBe('google');
    cred1.provider = 'smartschool';
    expect(component.getPlatformLink(cred1)).toBe('smartschool');
    cred1.provider = '';
    expect(component.getPlatformLink(cred1)).toBe('');
  });

  it('should return correct profile text', () => {
    cred1.provider = 'facebook';
    expect(component.getPlatformText(cred1)).toBe('Profiel-pagina');
    cred1.provider = 'google';
    expect(component.getPlatformText(cred1)).toBe('Profiel-pagina');
    cred1.provider = 'smartschool';
    expect(component.getPlatformText(cred1)).toBe(cred1.profile.platform);
    cred1.provider = '';
    expect(component.getPlatformText(cred1)).toBe('');
  });

  it('should call viewmodel when adding credential', () => {
    const sso: SingleSignOnProviderInterface = {
      providerId: 0,
      name: '',
      description: '',
      logoSrc: '',
      layoutClass: '',
      url: '',
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

  it('should return correct icon class', () => {
    expect(component.getIconForProvider('facebook')).toBe('facebook');
    expect(component.getIconForProvider('google')).toBe('google');
    expect(component.getIconForProvider('smartschool')).toBe(
      'smartschool:orange'
    );
    expect(component.getIconForProvider('')).toBe('');
  });
});
