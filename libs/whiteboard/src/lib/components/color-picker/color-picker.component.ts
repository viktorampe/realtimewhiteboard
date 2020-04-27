import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ColorInterface } from '../../models/color.interface';

export enum ColorPickerModeEnum {
  WHEEL,
  LIST
}

@Component({
  selector: 'campus-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  animations: [
    trigger('showHideSwatch', [
      transition(':enter', [
        style({ transform: 'rotate(-90deg) scale(0.5)', opacity: 0 }),
        animate(
          '250ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'rotate(0) scale(1)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ transform: 'rotate(0) scale(1)', opacity: 1 }),
        animate(
          '250ms cubic-bezier(.31,0,.43,1)',
          style({ transform: 'rotate(-90deg) scale(0.5)', opacity: 0 })
        )
      ])
    ])
  ]
})
export class ColorPickerComponent implements OnInit {
  public modes: typeof ColorPickerModeEnum = ColorPickerModeEnum;
  private _mode: ColorPickerModeEnum;

  @Input() active = false;
  @Input() activeColor: string;

  @Input()
  public get mode(): ColorPickerModeEnum {
    return this._mode;
  }
  public set mode(value: ColorPickerModeEnum) {
    this._mode = value;
    this.isList = this._mode === ColorPickerModeEnum.LIST;
    this.isWheel = this._mode === ColorPickerModeEnum.WHEEL;
  }

  @HostBinding('class.list') public isList = false;
  @HostBinding('class.wheel') public isWheel = true;

  @Input() colors: ColorInterface[] = [
    { label: 'blue', hexCode: '#00A7E2' },
    { label: 'red', hexCode: '#E22940' },
    { label: 'yellow', hexCode: '#FADB48' },
    { label: 'green', hexCode: '#2EA03D' },
    { label: 'purple', hexCode: '#5D3284' },
    { label: 'pink', hexCode: '#FF33CE' },
    { label: 'black', hexCode: '#222222' },
    { label: 'orange', hexCode: '#FF5733' }
  ];

  @Output() selectedColor = new EventEmitter<string>();

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {}

  clickColor(color: string) {
    this.toggleActive();
    this.activeColor = color;
    this.cdRef.detectChanges();
    this.selectedColor.emit(color);
  }
  toggleActive() {
    this.active = !this.active;
  }
}
