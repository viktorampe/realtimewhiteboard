import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';

@Component({
  selector: 'campus-card-toolbar',
  templateUrl: './card-toolbar.component.html',
  styleUrls: ['./card-toolbar.component.scss'],
  animations: [
    trigger('showHideToolbarTool', [
      transition(':enter', [
        style({ transform: 'scale(0) translateY(0px)' }),
        animate(
          '150ms ease-in-out',
          style({
            transform: 'scale(1) translateY(-48px)'
          })
        )
      ]),
      transition(':leave', [
        style({
          transform: 'scale(1) translateY(-48px)'
        }),
        animate(
          '150ms ease-in-out',
          style({ transform: 'scale(0) translateY(0px)' })
        )
      ])
    ])
  ]
})
export class CardToolbarComponent implements OnInit {
  @Input() mode: ModeEnum;

  @Output() clickDeleteIcon = new EventEmitter<void>();
  @Output() clickEditIcon = new EventEmitter<void>();
  @Output() clickConfirmIcon = new EventEmitter<void>();
  @Output() clickFlipIcon = new EventEmitter<void>();
  @Output() clickMultiSelectIcon = new EventEmitter<void>();
  @Output() clickMultiSelectSelectedIcon = new EventEmitter<void>();

  constructor() {}

  get Mode() {
    return ModeEnum;
  }

  ngOnInit() {}

  deleteIconClicked() {
    this.clickDeleteIcon.emit();
  }

  editIconClicked(event: MouseEvent) {
    this.clickEditIcon.emit();
    event.stopPropagation();
  }

  confirmIconClicked(event: MouseEvent) {
    this.clickConfirmIcon.emit();
    event.stopPropagation();
  }

  flipIconClicked(event: MouseEvent) {
    this.clickFlipIcon.emit();
    event.stopPropagation();
  }

  multiSelectClicked(event: MouseEvent) {
    this.clickMultiSelectIcon.emit();
    event.stopPropagation();
  }

  multiSelectSelectedClicked(event: MouseEvent) {
    this.clickMultiSelectSelectedIcon.emit();
    event.stopPropagation();
  }
}
