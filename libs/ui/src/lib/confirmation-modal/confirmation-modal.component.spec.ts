import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UiModule } from '../ui.module';
import { ConfirmationModalComponent } from './confirmation-modal.component';

// file.only
describe('ConfirmationPopUpComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'foo',
            message: 'bar'
          }
        },
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn() }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cancel should close the dialog with false value', () => {
    component.cancel();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('confirm should close the dialog with true value', () => {
    component.confirm();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });
});
