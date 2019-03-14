import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { EduContentBookInterface, EduContentTOCInterface } from '@campus/dal';
import { ResultItemBase } from '@campus/search';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { EduContentSearchResultInterface } from './interfaces/educontent-search-result';

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

  protected normalizedEduContentToc: any;

  constructor(
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.normalizedEduContentToc = this.getNormalizedEduContentToc();
  }

  public linkTask() {}

  public linkBundle() {}

  public unlinkTask() {}

  public unlinkBundle() {}

  public toggleFavorite() {}

  public openStatic() {
    //EduContent doesn't implement ContentInterface (yet ?)
    //this.openStaticContentService.open(this.data.eduContent);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.normalizedEduContentToc = this.getNormalizedEduContentToc();
    }
  }
}
