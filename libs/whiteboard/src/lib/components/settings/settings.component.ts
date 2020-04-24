import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ColorFunctions } from '@campus/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColorInterface } from '../../models/color.interface';
import { SettingsInterface } from '../../models/settings.interface';
import { ColorPickerModeEnum } from '../color-picker/color-picker.component';

@Component({
  selector: 'campus-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() activeColor: string;
  @Input() themeColor: string;
  @Input() title: string;
  @Input() colorPalettes: {
    [paletteName: string]: ColorInterface[];
  };

  @Output() update = new EventEmitter<SettingsInterface>();

  public settingsBoxShadow =
    '3px 3px 16px -1px rgba(217, 50, 138, 0.3), 9px 9px 16px #a3b1c6, -1px -1px 6px -3px rgba(217, 50, 138, 0.2), -9px -9px 16px #ffffff';

  public colorPickerModes: typeof ColorPickerModeEnum = ColorPickerModeEnum;
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

    this.setBoxShadow();
  }

  private setBoxShadow() {
    const { r, g, b } = ColorFunctions.hexToRgb(this.themeColor);
    this.settingsBoxShadow = `3px 3px 16px -1px rgba(${r}, ${g}, ${b}, 0.3), 9px 9px 16px #a3b1c6, -1px -1px 6px -3px rgba(${r}, ${g}, ${b}, 0.2), -9px -9px 16px #ffffff`;
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      title: new FormControl(this.title || ''),
      colorPalette: new FormControl('')
    });
  }

  setThemeColor(color: string) {
    this.themeColor = color;
    this.setBoxShadow();
  }

  onSubmit() {
    this.update.emit({
      title: this.settingsForm.value.title,
      defaultColor: this.themeColor
    });
  }
}
