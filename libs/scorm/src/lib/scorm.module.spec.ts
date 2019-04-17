import { async, TestBed } from '@angular/core/testing';
import { ScormModule } from './scorm.module';

describe('ScormModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScormModule]
    });
  }));

  it('should create', () => {
    expect(ScormModule).toBeDefined();
  });
});
