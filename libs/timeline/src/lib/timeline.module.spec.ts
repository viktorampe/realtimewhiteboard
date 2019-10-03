import { async, TestBed } from '@angular/core/testing';
import { TimelineModule } from './timeline.module';

describe('TimelineModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimelineModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TimelineModule).toBeDefined();
  });
});
