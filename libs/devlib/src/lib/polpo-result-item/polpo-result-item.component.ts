import { Component, Input, OnInit } from '@angular/core';
import { EduContentMetadataInterface } from '@campus/dal';
import { SearchResultItemComponentInterface } from '@campus/search';

@Component({
  selector: 'campus-polpo-result-item',
  templateUrl: './polpo-result-item.component.html',
  styleUrls: ['./polpo-result-item.component.scss']
})
export class PolpoResultItemComponent
  implements OnInit, SearchResultItemComponentInterface {
  @Input() data: EduContentMetadataInterface;

  constructor() {}

  ngOnInit() {}
}
