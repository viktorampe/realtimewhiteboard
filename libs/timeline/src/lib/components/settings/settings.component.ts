import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { TimelineSettingsInterface } from '../../interfaces/timeline';

@Component({
  selector: 'campus-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  @Input() settings: TimelineSettingsInterface;

  @Output() isDirty$: Observable<boolean>;
  //@Output() saveSettings: TimelineSettingsInterface;
  @Output() saveSettings = new EventEmitter<TimelineSettingsInterface>();
  public settingsForm: FormGroup;
  private initialFormValues: any; // used for isDirty$
  private subscriptions: Subscription;
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      scaleFactor: 1,
      humanCosmological: false,
      relative: false
    });
  }

  private initialStreams() {
    this.settingsForm
      .get('scaleFactor')
      .setValue(
        this.settings.options.scale_factor || this.formDefaults.scaleFactor
      );
    this.settingsForm
      .get('humanCosmological')
      .setValue(
        (this.settings.scale || this.formDefaults.humanCosmological) ===
          'cosmological'
      );
    this.settingsForm
      .get('relative')
      .setValue(this.settings.options.relative || this.formDefaults.relative);

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
