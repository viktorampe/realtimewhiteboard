import {
  Component,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Optional
} from '@angular/core';
import { ResultItemBase } from '@campus/search';
import {
  ContentActionInterface,
  ContentOpenActionsServiceInterface,
  ContentTaskActionsServiceInterface,
  CONTENT_OPEN_ACTIONS_SERVICE_TOKEN,
  CONTENT_TASK_ACTIONS_SERVICE_TOKEN,
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
  @HostBinding('class.app-educontentsearchresult--included')
  public isInTask = false;

  @Input() data: EduContentSearchResultInterface;

  actions: ContentActionInterface[];

  @HostBinding('class.app-educontentsearchresult')
  appEduContentSearchResultClass = true;

  @HostBinding('attr.data-cy')
  dataCy = 'search-result';

  constructor(
    @Inject(CONTENT_OPEN_ACTIONS_SERVICE_TOKEN)
    private contentOpenActionsService: ContentOpenActionsServiceInterface,
    @Optional()
    @Inject(CONTENT_TASK_ACTIONS_SERVICE_TOKEN)
    private contentTaskActionsService: ContentTaskActionsServiceInterface
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.update();
  }

  public update() {
    super.update();
    this.isInTask = this.data.inTask;
    this.setupActions();
  }

  private setupActions(): void {
    this.actions = this.contentOpenActionsService.getActionsForEduContent(
      this.data.eduContent
    );

    if (this.data.addTaskActions) {
      if (!this.contentTaskActionsService) {
        throw new Error(
          'CONTENT_TASK_ACTIONS_SERVICE_TOKEN not provided in module'
        );
      }
      this.actions = [
        ...this.contentTaskActionsService.getTaskActionsForEduContent(
          this.data.eduContent,
          this.data.inTask
        ),
        ...this.actions
      ];
    }
  }

  onActionClick(action: ContentActionInterface) {
    action.handler(this.data.eduContent);
  }
}
