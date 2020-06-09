import { Component, Directive, HostBinding, Input } from '@angular/core';

/**
 * Icon of a ListItem, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusListItemIcon], [ListItemIcon], list-item-icon, [list-item-icon]'
})
export class ListItemIconDirective {
  @HostBinding('class.ui-list-item__icon') private isListItemIcon = true;
}

/**
 * Title of a ListItem, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusListItemTitle], [ListItemTitle], list-item-title, [list-item-title]'
})
export class ListItemTitleDirective {
  @HostBinding('class.ui-list-item__title') private isListItemTitle = true;
}

/**
 * Caption of a ListItem, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusListItemCaption], [ListItemCaption], list-item-caption, [list-item-caption]'
})
export class ListItemCaptionDirective {
  @HostBinding('class.ui-list-item__caption') private isListItemCaption = true;
}

/**
 * Actions of a ListItem, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusListItemActions], [ListItemActions], list-item-actions, [list-item-actions]'
})
export class ListItemActionsDirective {
  @HostBinding('class.ui-list-item__actions') private isListItemActions = true;
}

/**
 * Additional content of a ListItem, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusListItemContent], [ListItemContent], list-item-content, [list-item-content]'
})
export class ListItemContentDirective {
  @HostBinding('class.ui-list-item__content-right')
  public isListItemContent = true;
}

@Component({
  selector: 'campus-list-item-content',
  templateUrl: './list-item-content.component.html',
  styleUrls: ['./list-item-content.component.scss']
})
export class ListItemContentComponent {
  @HostBinding('class.ui-list-item') public isListItemContent = true;

  @Input() contentRightSeparated = false;
}
