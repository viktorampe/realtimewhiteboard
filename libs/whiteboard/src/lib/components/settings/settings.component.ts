import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColorInterface } from '../../models/color.interface';
import { SettingsInterface } from '../../models/settings.interface';

@Component({
  selector: 'campus-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() themeColor: string;
  @Input() title: string;
  @Input() colorPalettes: {
    [paletteName: string]: ColorInterface[];
  };

  @Output() update = new EventEmitter<SettingsInterface>();

  settingsForm: FormGroup;
  colorPaletteNames: string[];
  paletteColors$: Observable<ColorInterface[]>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.colorPaletteNames = Object.keys(this.colorPalettes);
    this.settingsForm = this.buildForm();
    this.paletteColors$ = this.settingsForm
      .get('colorPalette')
      .valueChanges.pipe(
        map(colorPaletteName => this.colorPalettes[colorPaletteName])
      );
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      title: new FormControl(this.title || ''),
      colorPalette: new FormControl('')
    });
  }

  setThemeColor(color: string) {
    this.themeColor = color;
  }

  onSubmit() {
    this.update.emit({
      title: this.settingsForm.value.title,
      defaultColor: this.themeColor
    });
  }
}
