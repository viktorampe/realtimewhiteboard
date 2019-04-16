import { async, TestBed } from '@angular/core/testing';
import { DalModule } from './dal.module';

describe('DalModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DalModule]
    });
  }));

  it('should create', () => {
    expect(DalModule).toBeDefined();
  });
});
