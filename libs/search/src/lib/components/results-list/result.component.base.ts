import { Input, OnInit } from '@angular/core';
import { SearchResultItemInterface } from '@campus/search';
import {
  ListFormat,
  ListViewComponent,
  ListViewItemDirective,
  ListViewItemInterface
} from '@campus/ui';
/**
 * Base class for a dynamically loaded PolpoResultItem
 * @property listRef - the campus-list-view  to add the item to.
 * @property data - the data to be displayed
 *
 * @extends ListViewItemDirective
 * @implements SearchResultItemInterface
 */
export abstract class ResultItemBase extends ListViewItemDirective<any>
  implements OnInit, SearchResultItemInterface, ListViewItemInterface {
  listFormat: ListFormat;
  @Input() data: any;
  @Input() listRef: ListViewComponent<any>;

  constructor() {
    super(null, null);
  }

  ngOnInit() {
    this.host = this;
    this.parentList = this.listRef;
    this.dataObject = this.data;
    if (this.listRef) this.listRef.addItem(this);
  }
}
