import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { UiModule } from './ui.module';

describe('UiModule', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule]
    });
  });

  it('should create', () => {
    expect(UiModule).toBeDefined();
  });
});
