import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { EduContent } from '@campus/dal';

@Component({
  selector: 'campus-method-favorite-tile',
  templateUrl: './method-favorite-tile.component.html',
  styleUrls: ['./method-favorite-tile.component.scss']
})
export class MethodFavoriteTileComponent {
  @Input() logoUrl: string;
  @Input() name: string;
  @Input() bookId: number;
  @Input() eduContent: EduContent;
  @Output() clickOpenBoeke: EventEmitter<EduContent> = new EventEmitter();

  @HostBinding('class.pages-home-method-favorite-tile')
  pagesHomeMethodFavoriteTileClass = true;

  openBoeke() {
    this.clickOpenBoeke.emit(this.eduContent);
  }
}
