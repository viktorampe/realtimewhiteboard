import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  DalState,
  EduContentActions,
  EduContentBookInterface,
  EduContentTOCInterface
} from '@campus/dal';
import { ResultItemBase } from '@campus/search';
import {
  EduContentCollectionManagerServiceInterface,
  EduContentSearchResultInterface,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { Store } from '@ngrx/store';

@Component({
  // tslint:disable-next-line
  selector: 'edu-content-search-result',
  templateUrl: './edu-content-search-result.component.html',
  styleUrls: ['./edu-content-search-result.component.scss'],
  animations: [
    trigger('collapseExpandTrigger', [
      transition(':enter', [
        style({ height: '0px' }),
        animate('.2s ease-out', style({ height: '*' }))
      ])
    ])
  ]
})
export class EduContentSearchResultComponent extends ResultItemBase
  implements OnInit, OnChanges {
  @Input() data: EduContentSearchResultInterface;

  public normalizedEduContentToc: any;

  constructor(
    private store: Store<DalState>,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN)
    private eduContentManagerService: EduContentCollectionManagerServiceInterface
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.normalizedEduContentToc = this.getNormalizedEduContentToc();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.normalizedEduContentToc = this.getNormalizedEduContentToc();
    }
  }

  public linkTask() {
    this.eduContentManagerService.manageTasksForContent(this.data.eduContent);
  }

  public linkBundle() {
    this.eduContentManagerService.manageBundlesForContent(
      this.data.eduContent,
      this.data.eduContent.publishedEduContentMetadata.learningAreaId
    );
  }

  public unlinkTask() {}

  public unlinkBundle() {}

  public toggleFavorite() {
    this.upsertEduContentToStore();
  }

  public openStatic() {
    this.upsertEduContentToStore();
    this.openStaticContentService.open(this.data.eduContent);
  }
  public openExercise(answers: boolean) {}

  public stream() {}

  public open() {
    //Check what kind of content it is (ludo.zip or not) and do openStatic or openExercise
    if (
      this.data.eduContent.publishedEduContentMetadata.fileExt !== 'ludo.zip'
    ) {
      this.openStatic();
    } else {
      //openExercise
    }
  }

  get isEduContentInCurrentBundle(): boolean {
    return (
      this.data.currentBundle.eduContents.find(
        e => e.id === this.data.eduContent.id
      ) !== undefined
    );
  }

  get isEduContentInCurrentTask(): boolean {
    return (
      this.data.currentTask.eduContents.find(
        e => e.id === this.data.eduContent.id
      ) !== undefined
    );
  }

  /**
   * Returns an array containing objects with the title and tocs list of every book
   */
  private getNormalizedEduContentToc() {
    const books: EduContentBookInterface[] = [];
    const booksToc: { [key: number]: EduContentTOCInterface[] } = {};

    this.data.eduContent.publishedEduContentMetadata.eduContentTOC.forEach(
      toc => {
        if (!booksToc[toc.treeId]) {
          booksToc[toc.treeId] = [];
          books.push(toc.eduContentBook);
        }

        booksToc[toc.treeId].push(toc);
      }
    );

    return {
      books: books,
      booksToc: booksToc
    };
  }

  private upsertEduContentToStore(): void {
    this.store.dispatch(
      new EduContentActions.UpsertEduContent({
        eduContent: this.data.eduContent.minimal
      })
    );
  }
}
