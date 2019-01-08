import { async, TestBed } from '@angular/core/testing';
import { PagesSettingsCredentialsModule } from './pages-settings-credentials.module';

describe('PagesSettingsCredentialsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSettingsCredentialsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesSettingsCredentialsModule).toBeDefined();
  });
});
