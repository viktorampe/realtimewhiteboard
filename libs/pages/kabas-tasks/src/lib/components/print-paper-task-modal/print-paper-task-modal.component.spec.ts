import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { PrintPaperTaskModalComponent } from './print-paper-task-modal.component';

describe('PrintPaperTaskModalComponent', () => {
  let component: PrintPaperTaskModalComponent;
  let fixture: ComponentFixture<PrintPaperTaskModalComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPaperTaskModalComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPaperTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
