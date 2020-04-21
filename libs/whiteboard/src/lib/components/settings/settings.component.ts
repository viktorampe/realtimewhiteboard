import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SettingsInterface } from '../../models/settings.interface';
import { ColorInterface } from '../color-list/color-list.component';

const defaultColorPaletteMap = {
  wouw: [
    {
      label: 'L1',
      hexCode: '#d9328a'
    },
    {
      label: 'L2',
      hexCode: '#00b3c4'
    },
    {
      label: 'L3',
      hexCode: '#afcb27'
    },
    {
      label: 'L4',
      hexCode: '#ea9d04'
    },
    {
      label: 'L5',
      hexCode: '#963a8e'
    },
    {
      label: 'L6',
      hexCode: '#e40521'
    }
  ],
  passepartout: [
    { label: 'L5', hexCode: '#6ec3c1' },
    {
      label: 'L6',
      hexCode: '#e94b2b'
    }
  ]
};

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
  } = defaultColorPaletteMap;

  @Output() update = new EventEmitter<SettingsInterface>();

  settingsForm: FormGroup;
  colorPaletteOptions = Object.keys(this.colorPalettes);
  pickedColorPalette$: Observable<string>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.settingsForm = this.buildForm();
    this.pickedColorPalette$ = this.settingsForm.get(
      'colorPalette'
    ).valueChanges;
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      title: new FormControl(this.title || ''),
      colorPalette: new FormControl('')
    });
  }

  setDefaultColor(color: string) {
    this.themeColor = color;
  }

  onSubmit() {
    this.update.emit({
      title: this.settingsForm.value.title,
      defaultColor: this.themeColor
    });
  }
}
