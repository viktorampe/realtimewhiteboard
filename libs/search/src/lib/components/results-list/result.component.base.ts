import { Input, OnInit } from '@angular/core';
import {
  ListFormat,
  ListViewComponent,
  ListViewItemDirective,
  ListViewItemInterface
} from '@campus/ui';
import { SearchResultItemComponentInterface } from '../../interfaces';

/**
 * Base class for a dynamically loaded PolpoResultItem
 * @property listRef - the campus-list-view  to add the item to.
 * @property data - the data to be displayed
 *
 * @extends ListViewItemDirective
 * @implements SearchResultItemInterface
 */
export abstract class ResultItemBase extends ListViewItemDirective<any>
  implements OnInit, SearchResultItemComponentInterface, ListViewItemInterface {
  listFormat: ListFormat;
  @Input() data: any;
  @Input() listRef: ListViewComponent<any>;

  constructor() {
    super(null, null);
  }

  ngOnInit() {
    this.itemHost = this;
    this.parentList = this.listRef;
    this.dataObject = this.data;
    if (this.listRef) this.listRef.addItem(this);
  }
}
