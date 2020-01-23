import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPaperTaskModalComponent } from './print-paper-task-modal.component';

describe('PrintPaperTaskModalComponent', () => {
  let component: PrintPaperTaskModalComponent;
  let fixture: ComponentFixture<PrintPaperTaskModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPaperTaskModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPaperTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
