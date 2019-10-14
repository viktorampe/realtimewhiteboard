import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  //@Output() saveSettings: TimelineSettingsInterface;
  @Output() saveSettings = new EventEmitter<TimelineSettingsInterface>();
  isHuman = false;
  isRelative = false;
  private initialFormValues: any; // used for isDirty$
  private formData: TimelineSettingsInterface;
  settingsForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formData.options.scale_factor = 4;
    this.settingsForm = this.buildForm();
    console.log(this.settings);
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      scaleFactor: [this.formData.options.scale_factor]
    });
  }

  public onChange(state) {
    console.log(state);
    switch (state) {
      case 'relative':
        this.isRelative = state.checked;
        break;
      case 'human':
        this.isHuman = state.checked;
        break;
    }
  }

  onSubmit(): void {
    console.log(this.formData);
    const outputData = this.formData;
    // if (this.settingsForm.valid) {
    //   const outputData = this.settingsForm.value;
    //   console.log(outputData);
    //   //this.saveSettings.emit(outputData);
    // }
  }
}
