import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'campus-form-input',
  template: `
  <div class="form-group">
    <label [for]="id">{{label}}</label>
    <input [id]="id" [name]="name" type="text" class="form-control {{class}}" [formControl]="control">
    <div *ngIf="control.invalid && (control.dirty || control.touched)" class="error">
      <div *ngIf="control.errors['required']">
        <i class="polpo-alert"></i>{{requiredLabel}}</div>
      <div *ngIf="control.errors['email']">
        <i class="polpo-alert"></i>{{invalidEmailLabel}}</div>
    </div>
  </div>
  `,
})
export class FormInputComponent {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() requiredLabel: string;
  @Input() invalidEmailLabel: string;
  @Input() name: string;
  @Input() id: string;
  @Input() class: string;
}
