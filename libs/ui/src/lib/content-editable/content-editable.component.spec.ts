import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { ButtonComponent } from '../button/button.component';
import { ContentEditableComponent } from './content-editable.component';

describe('ContentEditableComponent', () => {
  let component: ContentEditableComponent;
  let fixture: ComponentFixture<ContentEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentEditableComponent, ButtonComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the inputs when active is false', () => {
    let input = fixture.debugElement.query(
      By.css('.ui-content-editable__form-field')
    );

    expect(input.styles['display']).toBe('none');
  });

  describe('editing enabled (active = true)', () => {
    it('should display the form field containing the inputs', () => {
      component.active = true;
      fixture.detectChanges();

      const formField = fixture.debugElement.query(
        By.css('.ui-content-editable__form-field')
      );

      expect(formField.styles['display']).toBeNull();
    });

    it('should focus the input ', fakeAsync(() => {
      const inputElement = fixture.debugElement.query(
        By.css('.ui-content-editable__form-field input')
      ).nativeElement;

      spyOn(inputElement, 'focus');

      component.active = true;
      fixture.detectChanges();
      tick();

      expect(inputElement.focus).toHaveBeenCalled();
    }));
  });
});
