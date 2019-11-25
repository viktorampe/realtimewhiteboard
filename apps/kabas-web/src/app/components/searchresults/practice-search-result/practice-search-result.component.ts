import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { ResultItemBase } from '@campus/search';
import {
  ContentActionInterface,
  ContentActionsServiceInterface,
  CONTENT_ACTIONS_SERVICE_TOKEN,
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
    @Inject(CONTENT_ACTIONS_SERVICE_TOKEN)
    private contentActionsService: ContentActionsServiceInterface
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.setupActions();
  }

  private setupActions(): void {
    this.actions = this.contentActionsService.getActionsForEduContent(
      this.data.eduContent
    );
  }

  onActionClick(action: ContentActionInterface) {
    action.handler(this.data.eduContent);
  }
}
