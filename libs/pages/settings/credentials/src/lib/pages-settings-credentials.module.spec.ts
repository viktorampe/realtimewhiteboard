import { async, TestBed } from '@angular/core/testing';
import { SharedModule } from '@campus/shared';
import { PagesSettingsCredentialsModule } from './pages-settings-credentials.module';

describe('PagesSettingsCredentialsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSettingsCredentialsModule, SharedModule]
    });
  }));

  it('should create', () => {
    expect(PagesSettingsCredentialsModule).toBeDefined();
  });
});
