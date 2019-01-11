import { async, TestBed } from '@angular/core/testing';
import { PagesSettingsCredentialsModule } from '../pages-settings-credentials.module';
import { CredentialsComponent } from './credentials.component';

describe('CredentialsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSettingsCredentialsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CredentialsComponent).toBeDefined();
  });
});
