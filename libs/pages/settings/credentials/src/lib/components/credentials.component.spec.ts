import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WINDOW } from '@campus/browser';
import {
  CredentialErrors,
  CredentialsComponent
} from './credentials.component';

@NgModule({
  exports: [CredentialsComponent]
})
export class TestModule {}

describe('CredentialsComponent', () => {
  let component: CredentialsComponent;
  let fixture: ComponentFixture<CredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CredentialsComponent],
      providers: [{ provide: WINDOW, useValue: Window }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
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
});
