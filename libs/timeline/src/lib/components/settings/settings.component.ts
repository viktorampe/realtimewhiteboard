import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { TimelineSettingsInterface } from '../../interfaces/timeline';
@Component({
  selector: 'campus-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  public settingsForm: FormGroup;
  private initialFormValues: string; // used for isDirty$
  private subscriptions: Subscription;
  private formDefaults = {
    scale_factor: 1,
    humanCosmological: false,
    relative: false
  };

  @Input() settings: TimelineSettingsInterface;

  @Output() isDirty = new EventEmitter<boolean>();
  @Output() saveSettings = new EventEmitter<TimelineSettingsInterface>();

  constructor(private fb: FormBuilder) {}

  @HostBinding('class.timeline-settings') private isSettings = true;

  ngOnInit() {
    this.settingsForm = this.buildForm();
    this.initialStreams();
  }

  public onSubmit(): void {
    if (this.settingsForm.valid) {
      this.saveSettings.emit({
        scale: this.settingsForm.get('humanCosmological').value
          ? 'cosmological'
          : 'human',
        options: {
          relative: !!this.settingsForm.get('relative').value,
          scale_factor: this.settingsForm.get('scale_factor').value
        }
      });
    }
    this.initialFormValues = JSON.stringify(this.settingsForm.value);
    this.isDirty.emit(false);
  }

  private buildForm(): FormGroup {
    let settings;
    if (this.settings) {
      settings = {
        ...this.settings.options,
        humanCosmological: this.settings.scale === 'cosmological'
      };
    }

    return this.fb.group(Object.assign({}, this.formDefaults, settings), {
      updateOn: 'change'
    });
  }

  private initialStreams() {
    this.subscriptions = new Subscription();
    this.initialFormValues = JSON.stringify(this.settingsForm.value);

    // TODO test -> see Frederic -> has/had some issues
    this.subscriptions.add(
      this.settingsForm.valueChanges
        .pipe(
          debounceTime(300),
          map(
            updatedFormValues =>
              JSON.stringify(updatedFormValues) !== this.initialFormValues
          ),
          startWith(false)
        )
        .subscribe(value => this.isDirty.emit(value))
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
