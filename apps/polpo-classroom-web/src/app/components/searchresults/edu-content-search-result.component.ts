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
  EduContentBookInterface,
  EduContentTOCInterface,
  FavoriteInterface,
  FavoriteTypesEnum
} from '@campus/dal';
import { ResultItemBase } from '@campus/search';
import {
  EduContentCollectionManagerServiceInterface,
  EduContentSearchResultInterface,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { Observable } from 'rxjs';
import { EduContentSearchResultItemService } from './edu-content-search-result.service';
import { EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN } from './edu-content-search-result.service.interface';

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

  public isFavorite$: Observable<Boolean>;

  constructor(
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN)
    private eduContentManagerService: EduContentCollectionManagerServiceInterface,
    @Inject(EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN)
    private eduContentSearchResultService: EduContentSearchResultItemService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.isFavorite$ = this.eduContentSearchResultService.isFavorite$(
      this.data.eduContent.id
    );

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
    const favorite: FavoriteInterface = {
      name: this.data.eduContent.name,
      type:
        this.data.eduContent.type === 'boek-e'
          ? FavoriteTypesEnum.BOEKE
          : FavoriteTypesEnum.EDUCONTENT,
      eduContentId: this.data.eduContent.id,
      created: new Date(),
      learningAreaId: this.data.eduContent.publishedEduContentMetadata
        .learningAreaId
    };

    console.log(favorite);
    this.eduContentSearchResultService.toggleFavorite(favorite);
  }

  public openStatic() {
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
}
