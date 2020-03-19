import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'campus-collapsible-container',
  templateUrl: './collapsible-container.component.html',
  styleUrls: ['./collapsible-container.component.scss'],
  animations: [
    trigger('toggleOpened', [
      state('closed', style({ height: 0 })),
      state('opened,', style({ height: '*' })),

      transition(
        'closed <=> opened',
        animate('500ms cubic-bezier(.43,0,.31,1)')
      )
    ])
  ]
})
export class CollapsibleContainerComponent {
  @HostBinding('class.ui-collapsible-container')
  public uiCollapsibleContainerClass = true;

  @HostBinding('class.ui-collapsible-container--open')
  @Input()
  open = false;

  @Output() openChange = new EventEmitter<boolean>();

  @HostBinding('@toggleOpened')
  get toggleContainer(): string {
    return this.open ? 'opened' : 'closed';
  }

  constructor() {}
}
