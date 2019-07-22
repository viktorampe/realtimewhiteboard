import { Component, Inject, Input, OnInit } from '@angular/core';
import { ResultItemBase } from '@campus/search';
import { EduContentSearchResultInterface } from '@campus/shared';
import {
  EduContentSearchResultItemServiceInterface,
  EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN
} from './edu-content-search-result.service.interface';

@Component({
  // tslint:disable-next-line
  selector: 'edu-content-search-result',
  templateUrl: './edu-content-search-result.component.html',
  styleUrls: ['./edu-content-search-result.component.scss']
})
export class EduContentSearchResultComponent extends ResultItemBase
  implements OnInit {
  @Input() data: EduContentSearchResultInterface;

  constructor(
    @Inject(EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN)
    private eduContentSearchResultService: EduContentSearchResultItemServiceInterface
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
