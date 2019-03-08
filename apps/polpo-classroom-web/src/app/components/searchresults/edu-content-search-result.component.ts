import { Component, Input, OnInit } from '@angular/core';
import { ResultItemBase } from '@campus/search';
import { EduContentSearchResultInterface } from './interfaces/educontent-search-result';

@Component({
  selector: 'edu-content-search-result',
  templateUrl: './edu-content-search-result.component.html',
  styleUrls: ['./edu-content-search-result.component.scss']
})
export class EduContentSearchResultComponent extends ResultItemBase
  implements OnInit {
  @Input() data: EduContentSearchResultInterface;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
