import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ContentInterface, EduContent } from '@campus/dal';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import { BooksViewModel } from '../books.viewmodel';

@Component({
  selector: 'campus-book',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  listFormat = ListFormat;
  listFormat$: Observable<ListFormat> = this.viewModel.listFormat$;
  books$: Observable<EduContent[]>;

  @ViewChild(FilterTextInputComponent, { static: true })
  filterTextInput: FilterTextInputComponent<EduContent[], EduContent>;

  constructor(
    private viewModel: BooksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.books$ = this.viewModel.sharedBooks$;
    this.filterTextInput.setFilterableItem(this);
  }

  openBook(book: ContentInterface) {
    this.viewModel.openBook(book);
  }

  setListFormat(format: ListFormat) {
    this.viewModel.changeListFormat(format);
  }

  filterFn(source: EduContent[], searchText: string): EduContent[] {
    return this.filterService.filter(source, { name: searchText });
  }
}
