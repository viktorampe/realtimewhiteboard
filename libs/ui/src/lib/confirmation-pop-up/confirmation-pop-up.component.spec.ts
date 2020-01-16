import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { ConfirmationPopUpComponent } from './confirmation-pop-up.component';

// file.only
describe('ConfirmationPopUpComponent', () => {
  let component: ConfirmationPopUpComponent;
  let fixture: ComponentFixture<ConfirmationPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
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
      ],
      declarations: [ConfirmationPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPopUpComponent);
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
