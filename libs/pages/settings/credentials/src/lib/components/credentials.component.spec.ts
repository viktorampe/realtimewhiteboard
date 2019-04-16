import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CredentialFixture } from '@campus/dal';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
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
  let mockActivatedRoute: ActivatedRoute;
  const error = 'Foo error message';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, UiModule, SharedModule, RouterTestingModule],
      declarations: [CredentialsComponent],
      providers: [
        {
          provide: CredentialsViewModel,
          useClass: MockCredentialsViewModel
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => error
              }
            }
          }
        },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
    viewmodel = TestBed.get(CredentialsViewModel);
    mockActivatedRoute = TestBed.get(ActivatedRoute);
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
    expect(viewmodel.linkCredential).toHaveBeenCalledWith(sso);
  });

  it('should call viewmodel when removing credential', () => {
    jest.spyOn(viewmodel, 'unlinkCredential');
    component.decoupleCredential(cred1);
    expect(viewmodel.unlinkCredential).toHaveBeenCalledWith(cred1);
  });
  it('should call viewmodel when setting avatar', () => {
    jest.spyOn(viewmodel, 'useProfilePicture');
    component.changeAvatar(cred1);
    expect(viewmodel.useProfilePicture).toHaveBeenCalledWith(cred1);
  });

  describe('error handling', () => {
    let handleLinkErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      handleLinkErrorSpy = jest.spyOn(viewmodel, 'handleLinkError');
    });

    it('should call getError() onInit', () => {
      const getErrorSpy = jest.spyOn(component, 'getError');

      component.ngOnInit();

      expect(getErrorSpy).toHaveBeenCalledTimes(1);
    });
    it('should not call viewmodel.handleLinkError when there is no error in the query string', () => {
      mockActivatedRoute.snapshot.queryParamMap.get = () => null;

      component.getError();

      expect(handleLinkErrorSpy).not.toHaveBeenCalled();
    });
    it('should call viewmodel.handleLinkError when there is an error in the query string', () => {
      component.getError();

      expect(handleLinkErrorSpy).toHaveBeenCalledTimes(1);
      expect(handleLinkErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
