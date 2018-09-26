import { Input } from '@angular/core';

export abstract class ListViewItem {
  @Input() listFormat: string;
}
