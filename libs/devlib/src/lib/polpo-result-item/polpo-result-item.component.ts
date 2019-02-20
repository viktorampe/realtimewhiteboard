import { Component, Input, OnInit } from '@angular/core';
import { EduContentMetadataInterface } from '@campus/dal';
import { SearchResultItemInterface } from '@campus/search';

@Component({
  selector: 'campus-polpo-result-item',
  templateUrl: './polpo-result-item.component.html',
  styleUrls: ['./polpo-result-item.component.scss']
})
export class PolpoResultItemComponent
  implements OnInit, SearchResultItemInterface {
  @Input() data: EduContentMetadataInterface;

  constructor() {}

  ngOnInit() {}
}
