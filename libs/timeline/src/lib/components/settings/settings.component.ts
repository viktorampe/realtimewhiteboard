import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TimelineSettingsInterface } from '../../interfaces/timeline';

@Component({
  selector: 'campus-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() settings: TimelineSettingsInterface;

  @Output() isDirty$: Observable<boolean>;
  @Output() saveSettings: TimelineSettingsInterface;

  private initialFormValues: any; // used for isDirty$

  settingsForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.settingsForm = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({});
  }
}
