import { Component, Inject, Input, OnInit } from '@angular/core';
import { ResultItemBase } from '@campus/search';
import {
  ContentActionsServiceInterface,
  CONTENT_ACTIONS_SERVICE_TOKEN,
  EduContentSearchResultInterface
} from '@campus/shared';

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
    @Inject(CONTENT_ACTIONS_SERVICE_TOKEN)
    private contentActionsServiceInterface: ContentActionsServiceInterface
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
