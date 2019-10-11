import { async, TestBed } from '@angular/core/testing';
import { ElementsInkModule } from './elements-ink.module';

describe('ElementsInkModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ElementsInkModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ElementsInkModule).toBeDefined();
  });
});
