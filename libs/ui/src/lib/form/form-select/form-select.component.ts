import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'campus-form-select',
  template: `
  <div class="form-group">
        <label for="subject">{{label}}</label>
        <select class="form-control" [formControl]="control">
          <option *ngFor="let option of options" [ngValue]="option">{{option}}</option>
        </select>
        <div *ngIf="control.invalid && (control.dirty || control.touched)" class="error">
          <div *ngIf="control.errors['required']">
            <i class="polpo-alert"></i>{{requiredLabel}}</div>
        </div>
      </div>
  `,
})
export class FormSelectComponent {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() requiredLabel: string;
  @Input() options: string[];
}
