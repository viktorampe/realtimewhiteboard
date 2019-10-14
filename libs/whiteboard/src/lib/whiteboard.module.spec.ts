import { async, TestBed } from '@angular/core/testing';
import { WhiteboardModule } from './whiteboard.module';

describe('WhiteboardModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(WhiteboardModule).toBeDefined();
  });
});
