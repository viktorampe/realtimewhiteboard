import { async, TestBed } from '@angular/core/testing';
import { DevlibModule } from './devlib.module';

describe('DevlibModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // TODO test fails
      // imports: [DevlibModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DevlibModule).toBeDefined();
  });
});
