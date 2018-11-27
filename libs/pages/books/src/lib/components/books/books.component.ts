import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EduContent } from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { BooksViewModel } from '../books.viewmodel';

@Component({
  selector: 'campus-book',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  protected listFormat = ListFormat;
  listFormat$: Observable<ListFormat> = this.viewModel.listFormat$;
  books$: Observable<EduContent[]>;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<EduContent[], EduContent>;

  private routeParams$ = this.route.params.pipe(shareReplay(1));

  constructor(
    private route: ActivatedRoute,
    private viewModel: BooksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    //TODO: in de gaten houden waarom dit 4x triggert, mss gevolg van mock?
    this.books$ = this.viewModel.sharedBooks$.pipe(tap(x => console.log(x)));
    this.filterTextInput.setFilterableItem(this);
  }

  setListFormat(format: ListFormat) {
    this.viewModel.changeListFormat(format);
  }

  filterFn(source: EduContent[], searchText: string): EduContent[] {
    const books = this.filterService.filter(source, { name: searchText });
    return books;
  }
}
