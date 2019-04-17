import { async, TestBed } from '@angular/core/testing';
import { PagesSettingsProfileModule } from './pages-settings-profile.module';

describe('PagesSettingsProfileModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSettingsProfileModule]
    });
  }));

  it('should create', () => {
    expect(PagesSettingsProfileModule).toBeDefined();
  });
});
