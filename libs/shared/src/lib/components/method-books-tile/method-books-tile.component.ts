import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';

export interface BookYear {
  id: number;
  name: string;
  bookId: number;
}
@Component({
  selector: 'campus-method-books-tile',
  templateUrl: './method-books-tile.component.html',
  styleUrls: ['./method-books-tile.component.scss']
})
export class MethodBooksTileComponent implements OnInit {
  @Input() logoUrl: string;
  @Input() name: string;
  @Input() years: BookYear[] = [];
  @Input() useQueryParams = false;

  @Output() linkClick = new EventEmitter<number>();

  @HostBinding('class.shared-method-books-tile')
  pagesMethodsMethodBooksTileClass = true;

  constructor() {}

  ngOnInit() {}

  public clickLink(year: BookYear) {
    this.linkClick.emit(year.bookId);
  }
}
