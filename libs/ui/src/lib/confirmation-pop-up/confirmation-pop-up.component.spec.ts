import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmationPopUpComponent } from './confirmation-pop-up.component';

// file.only
describe('ConfirmationPopUpComponent', () => {
  let component: ConfirmationPopUpComponent;
  let fixture: ComponentFixture<ConfirmationPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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

  it('should execute the action handlers', () => {
    component.actions = [
      {
        handler: jest.fn(),
        icon: 'foo',
        label: 'foo'
      }
    ];

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    button.click();
    expect(component.actions[0].handler).toHaveBeenCalled();
  });
});
