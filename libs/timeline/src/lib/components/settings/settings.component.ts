import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
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
  public settingsForm: FormGroup;
  private initialFormValues: any; // used for isDirty$
  private formDefaults = {
    scaleFactor: 1,
    humanCosmological: 'human',
    relative: false
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.settingsForm = this.buildForm();
    this.initialStreams();
  }

  private buildForm(): FormGroup {
    let settings;
    if (this.settings) {
      settings = { ...this.settings.options, scale: this.settings.scale };
    }

    return this.fb.group(
      Object.assign(
        {
          scaleFactor: 1,
          humanCosmological: false,
          relative: false
        },
        settings
      )
    );
  }

  private initialStreams() {
    this.initialFormValues = { ...this.settingsForm.value };
    this.isDirty$ = this.settingsForm.valueChanges.pipe(
      debounceTime(300),
      map(
        updatedFormValues =>
          !(
            JSON.stringify(updatedFormValues) ===
            JSON.stringify(this.initialFormValues)
          )
      ),
      startWith(false)
    );
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.saveSettings.emit({
        scale:
          this.settingsForm.get('humanCosmological').value ||
          this.formDefaults.humanCosmological,
        options: {
          relative: !!this.settingsForm.get('relative').value,
          scale_factor:
            this.settingsForm.get('scaleFactor').value ||
            this.formDefaults.scaleFactor
        }
      });
    }
  }
}
