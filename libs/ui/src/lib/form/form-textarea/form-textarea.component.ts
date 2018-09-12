import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'campus-form-textarea',
  template: `
  <div class="form-group">
        <label>Bericht</label>
        <textarea class="form-control" rows="{{rows}}" [formControl]="control"></textarea>
        <div *ngIf="control.invalid && (control.dirty || control.touched)" class="error">
          <div *ngIf="control.errors['required']">
            <i class="polpo-alert"></i>{{requiredLabel}}</div>
        </div>
      </div>
  `,
})
export class FormTextareaComponent {
  @Input() control: FormControl;
  @Input() rows: number;
  @Input() label: string;
  @Input() requiredLabel: string;
}
