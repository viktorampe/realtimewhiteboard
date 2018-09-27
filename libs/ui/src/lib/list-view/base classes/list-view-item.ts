import { Input } from '@angular/core';

export abstract class ListViewItemInterface {
  @Input() listFormat: string;
}
