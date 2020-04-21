import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

export interface ColorInterface {
  colorName: string;
  hexCode: string;
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
  @Input() activeColor: string;
  @Input() colors: ColorInterface[] = [
    { colorName: 'blue', hexCode: '#00A7E2' },
    { colorName: 'green', hexCode: '#2EA03D' },
    { colorName: 'red', hexCode: '#E22940' },
    { colorName: 'purple', hexCode: '#5D3284' },
    { colorName: 'yellow', hexCode: '#FADB48' },
    { colorName: 'green', hexCode: '#2EA03D' },
    { colorName: 'red', hexCode: '#E22940' },
    { colorName: 'purple', hexCode: '#5D3284' }
  ];

  @Output() selectedColor = new EventEmitter<string>();

  public active = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {}

  clickColor(color: string) {
    this.toggleActive();
    this.cdRef.detectChanges();
    this.selectedColor.emit(color);
  }
  toggleActive() {
    this.active = !this.active;
  }
}
