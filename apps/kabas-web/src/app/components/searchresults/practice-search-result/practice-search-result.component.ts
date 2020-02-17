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
  selector: 'practice-search-result',
  templateUrl: './practice-search-result.component.html',
  styleUrls: ['./practice-search-result.component.scss']
})
export class PracticeSearchResultComponent extends ResultItemBase
  implements OnInit {
  @Input() data: EduContentSearchResultInterface;

  actions: ContentActionInterface[];

  @HostBinding('class.app-practice-searchresult')
  appPracticeSearchResultClass = true;

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
