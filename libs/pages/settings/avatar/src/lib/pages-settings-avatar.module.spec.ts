import { async, TestBed } from '@angular/core/testing';
import { PagesSettingsAvatarModule } from './pages-settings-avatar.module';

describe('PagesSettingsAvatarModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSettingsAvatarModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PagesSettingsAvatarModule).toBeDefined();
  });
});
