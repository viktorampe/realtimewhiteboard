import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { ResultItemBase } from '@campus/search';
import {
  ContentActionInterface,
  ContentOpenActionsServiceInterface,
  CONTENT_OPEN_ACTIONS_SERVICE_TOKEN,
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

  actions: ContentActionInterface[];

  @HostBinding('class.app-educontentsearchresult')
  appEduContentSearchResultClass = true;

  constructor(
    @Inject(CONTENT_OPEN_ACTIONS_SERVICE_TOKEN)
    private contentOpenActionsService: ContentOpenActionsServiceInterface
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.setupActions();
  }

  private setupActions(): void {
    this.actions = this.contentOpenActionsService.getActionsForEduContent(
      this.data.eduContent
    );
  }

  onActionClick(action: ContentActionInterface) {
    action.handler(this.data.eduContent);
  }
}
