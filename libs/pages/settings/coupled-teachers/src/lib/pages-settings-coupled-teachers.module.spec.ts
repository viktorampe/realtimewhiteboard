import { async, TestBed } from '@angular/core/testing';
import { PagesSettingsCoupledTeachersModule } from './pages-settings-coupled-teachers.module';

describe('PagesSettingsCoupledTeachersModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PagesSettingsCoupledTeachersModule]
    });
  }));

  it('should create', () => {
    expect(PagesSettingsCoupledTeachersModule).toBeDefined();
  });
});
